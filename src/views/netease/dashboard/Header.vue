<template>
  <div class="header line-center drag">
      <div class="logo-wrapper line-center nodrag-pointer" @click="tofind">
          <div class="logo"></div>
          <div class="name">网易云音乐</div>
      </div>
      <div class="search-wrapper line-center">
          <span class="prev el-icon-arrow-left nodrag-pointer" @click="prev" :class="{'active':true}" ></span>
          <span class="next el-icon-arrow-right nodrag-pointer" @click="next" :class="{'active':true}"  ></span>
          <input class="search text nodrag" type="text" placeholder="搜索" 
            @focus="inithotSearch"  v-model="keywords" @keyup="adviseSearch"  @keyup.enter="searchAll"
          />
          <i class="el-icon-search icon-search nodrag" @click="searchAll"></i>
          <i class="el-icon-microphone icon-mic nodrag"  @click="toMic"></i>
      </div>
  </div>
</template>

<script>
import {mapMutations,mapGetters,mapActions} from 'vuex'
import * as Api from '@/services/netease/dashboard'
import {Axios,cellLogin,getUserSongList,getUserCollectSinger,getUserLikeMusic,
getUserPlayHistory,Logout,getHotSearch,adviseSearch,getAlbumDetail,getSongUrl,
getCollectAlbum} from './api'

const {ipcRenderer} = import('electron')

export default {
    data() {
        return {
            keywords: '',
            hotSearchList: null,
        }
    },
    computed: {
        ...mapGetters([
            
        ])
    }, 
    components: {
        // DropList
    },
    created() {
        this.cookies = document.cookie.split(';')   
        this.checkLogin()
    },
    methods: {
        // 最小化窗口
        min() {
            ipcRenderer.send('min')
        },
        // 最大化窗口
        max() {
            ipcRenderer.send('max')
        },
        // 关闭窗口
        close() {
            ipcRenderer.send('close')
        },
        // 返回上一层
        prev() {  
            this.$router.goBack()
        },
        // 返回下一层
        next() { 
            this.$router.go(1)
        },
        // 关闭登录模态框
        handleClose(done) {
            this.dialogVisible = false
        },
        // 关闭确认退出模态框
        handleLogutClose(done) {
            this.logoutVisible = false
        },
        // 回首页
        tofind() {
            this.$router.push('/find')
        },
        // 检查登录状态
        checkLogin() {
            console.log(this.$store.state.userlogin.loginStatus === 'ok')
            if(this.$store.state.userlogin.loginStatus !== 'ok') return 
           

        },

        

        // 登录
        login() {
            const params = {
                phone: this.username,
                password: this.password,
                timestamp: (new Date()).getTime()
            }
            Axios(cellLogin,params).then((res) => {
                this.id = res.account.id
                this.params = {
                    uid : this.id
                }
                this.setUserName(this.username)
                this.setNickName(res.profile.nickname)
                this.setUserId(res.profile.userId)
                this.setAvatarUrl(res.profile.avatarUrl)
                // this.password = encrypt.Encrypt(this.password)
                document.cookie = `info=username:${this.username}&password:${this.password};max-age=1000*60*60*24*3;`
                localStorage.setItem("nickName", this.nickName)
                localStorage.setItem("avatarUrl", this.avatarUrl)
                localStorage.setItem("userId", res.profile.userId)
                this.username = ''
                this.password = ''
                this._initCollects()
            }).catch(()=>{
                alert('手机号或者密码错误')
                this.username = ''
                this.password = ''
            })
            this.dialogVisible = false
        },
        // 退出登录
        logout() {
            Axios(Logout).then((result) => {
                this.setUserName('')
                this.setNickName('')
                this.setAvatarUrl('')
                document.cookie = `info=username:${this.username}&password:${this.password};expires=-1`
                localStorage.setItem("nickName", '');
                localStorage.setItem("avatarUrl", '');
                localStorage.setItem("userId", '');
                this.drap = false;
                this.logoutVisible = false
                this.$router.push('/find/recommend')
            })
        },
        //  初始化用户歌单列表
        initCollectSongList() {
            Axios(getUserSongList,this.params).then((res) => {
                const ret = []
                res.playlist.forEach((item) => {
                    ret.push(item.id)
                })
                this.set_collectSongList(ret)
            })
        },

        // 初始化用户收藏歌手列表
        initCollectSingerList() {
            Axios(getUserCollectSinger,this.params).then((res) => {
                const ret = []
                res.data.forEach((item) => {
                    ret.push(item.id)
                })
                this.set_collectSinger(ret)
            })
        },
        // 初始化喜欢音乐
        initLikeMusic() {
            Axios(getUserLikeMusic,this.params).then((res) => {
                this.set_collectSong(res.ids)
            })
        },
        // 初始化已收藏专辑列表
        initCollectAlbum() {
            Axios(getCollectAlbum,this.params).then((res) => {
                const ret = []
                res.data.forEach((item) => {
                    ret.push(item.id)
                })
                this.setCollectAlbum(ret)
            })
        },
        // 初始化播放历史
        initHistory() {
            const params = {
                uid:this.id,
                type:1
            }
            Axios(getUserPlayHistory,params).then((res) => {
                const list = []
                res.weekData.forEach((item) => {
                    list.push(item.song)
                })
                this._normalizeSongs(list)
            })
        },
        // 展示下拉框
        showDrap() {
            this.drap = !this.drap;
        },
        
        // 初始化热搜列表
        inithotSearch() {
            if(this.keywords != '') {
                this.adviseDrap = true
                this.adviseSearch()
            }else{
                this.searchDrap = true
                if(this.hotSearchList) {
                    return
                }
                getHotSearch({keywords: this.keywords}).then((res) => {
                    this.hotSearchList = res.result.hots
                })
                if(localStorage.getItem('hisSearchList')) {
                    this.hisSearchList = JSON.parse(localStorage.getItem('hisSearchList'))
                }
            }
        },
        //  搜索热搜内容
        hotSearch(keywords) {
            this.keywords = keywords
            this.searchDrap = false
            if(this.hisSearchList.includes(keywords)) {
                const index = this.hisSearchList.indexOf(keywords)
                this.hisSearchList.splice(index,1)
                this.hisSearchList.unshift(keywords)
                localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
            }else {
                this.hisSearchList.push(keywords)
                localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
            }
            this.searchAll()
        },
        //  删除搜索历史记录
        delHisSearchItem(index) {
            this.hisSearchList.splice(index,1)
            localStorage.setItem('hisSearchList',JSON.stringify(this.hisSearchList))
        },
        //  显示建议搜索的内容
        adviseSearch() {
            clearTimeout(this.iTime);
            this.iTime = setTimeout(() => {
                if(this.keywords == "") {
                    this.searchDrap = true
                    this.adviseDrap = false
                    return
                }else{
                    this.searchDrap = false
                    this.adviseDrap = true
                    const params = {
                        keywords: this.keywords
                    }
                    Axios(adviseSearch,params).then((res) => {
                        this.adviseSearchList = res.result
                        this.adviseSongList = this._normalizeSongs(this.adviseSearchList.songs)
                    })
                }
            }, 200);
        },
        playSong(mid,aid,index) {

            Axios(getAlbumDetail,{
                id: aid
            }).then((res) => {
                const picUrl = res.album.picUrl
                this.adviseSongList[index].picUrl = picUrl
            })
            Axios(getSongUrl,{
                id: mid
            }).then((res) => {
                const url = res.data[0].url
                this.adviseSongList[index].url = url
                this.insertSong(this.adviseSongList[index])
                this.adviseDrap = false 
            })
        },
        toSinger(id) {
            this.$router.push(`/singerDetail/${id}`)
            this.adviseDrap = false
        },
        toSongList(id) {
            this.$router.push(`/songListDetail/${id}`)
            this.adviseDrap = false
        },
        toAlbum(id) {
            this.$router.push(`/album/${id}`)
            this.adviseDrap = false
        },
        searchAll() {
            this.$router.push(`/search/${this.keywords}`)
            this.adviseDrap = false
            this.searchDrap = false
        },
        _normalizeSongs(list) {
            const ret = []
            for(let i = 0; i < list.length; i ++) {
                ret.push((list[i]))
            }
            this.setPlayHistoryList(ret)
            return ret
        },
        // 初始化收藏类函数
        _initCollects() {
            this.initCollectSongList()
            this.initCollectSingerList()
            this.initLikeMusic()
            this.initHistory()
            this.initCollectAlbum()
        },
        ...mapMutations({
            setUserName: 'SET_USERNAME',
            setNickName: 'SET_NICKNAME',
            setUserId: 'SET_USERID',
            setAvatarUrl: 'SET_AVATARURL',
            // set_collectSongList:'SET_COLLECTSONGLIST',
            // set_collectSinger:'SET_COLLECTSINGER',
            // set_collectSong:'SET_COLLECTSONG',
            setPlayHistoryList:'SET_PLAYHISTORYLIST',
            setCollectAlbum:'SET_COLLECTALBUM'
        }),
        ...mapActions([
            'insertSong'
        ]),
        //听歌识曲
        toMic(){
            console.log(1)
        }
    },
}
</script>

<style lang="scss">
@import '../../../assets/css/base.scss';
.line-center{
    display: flex;
    align-items: center;
}
.header{
    width: 100%;
    height: 60px;
    background-color: #ff1a1ad1
}
.drag{
    -webkit-app-region: drag;
}
.nodrag{
    -webkit-app-region: no-drag;
}
.nodrag-pointer{
    -webkit-app-region: no-drag;
    cursor: pointer;
}
.iconfont {
    font-size: 12px;
    margin-right: 5px;
}
.logo-wrapper {
    // width: 180px;
    height: 100%;
    margin-right: 50px;
    .logo {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        margin: 0 2px 0 18px;
        background: url('../../../assets/images/logo.jpg') no-repeat center;
        background-size: cover;
    }
    .name {
        color: white;
        font-weight: bold;
        margin-left: 5px;
        line-height: 25px;
        font-family:"幼圆";
    }
}
.search-wrapper{
    margin-left: 46px;
    span .active {
        color:white;
    }
    .prev,.next{
        border-radius: 50%;
        font-size: 14px;
        /* border: 1px solid #A82828; */
        background: rgba(179, 65, 65, 0.23);
        padding: 5px;
        color: rgba(255, 255, 255, 0.5);
    }
    .next {
        border-left:none;
        margin-right: 14px;
        margin-left: 8px;
    }
    input{
        width: 160px;
        border-radius: 30px;
        padding: 10px 11px 10px 30px;
        background: rgba(179, 65, 65, 0.23);
        -webkit-app-region: no-drag;
        color: white;
        box-sizing: border-box;
        border: none;
        font-size: 12px;
        &::placeholder {
            font-size: 12px;
            color: #f08989;
            // color: rgba(161,40,40,0.);
        }
        &:focus{
            border:none;
            outline: none;
        }
    }
    .icon-search{
        left: -146px;
    }
    .icon-mic, .icon-search {
        cursor: pointer;
        position: relative;
        color: #f1f1f1;
        font-size: 13px;
        &:hover{
            color: rgba(255, 255, 255, 0.6);
            transition: color .3s ease-in;
        }
    }
    .icon-mic {
        left: -2px;
        font-size: 18px;
        padding: 7px;
        background: rgba(179, 65, 65, 0.23);
        color: #f1f1f1;
        border-radius: 50%;
    }
}
</style>
    