<template>
  <div class="header line-center drag">
    <div class="logo-wrapper line-center nodrag-pointer" @click="tofind">
        <div class="logo"></div>
        <div class="name">网易云音乐</div>
    </div>
    <span class="search-wrapper line-center">
        <span class="prev el-icon-arrow-left nodrag-pointer" @click="prev" :class="{'active':true}" ></span>
        <span class="next el-icon-arrow-right nodrag-pointer" @click="next" :class="{'active':true}"  ></span>
        <input class="search text nodrag" type="text" placeholder="搜索" 
            v-model="keywords" 
            @focus="inithotSearch"  
            @keyup="adviseSearch" 
            @keyup.enter="searchAll"
        />
        <i class="el-icon-search icon-search nodrag" @click="searchAll"></i>
        <i class="el-icon-microphone icon-mic nodrag"  @click="toMic"></i>
    </span>
    <transition name="fade">
        <div class="search-list" v-if="showTrending || showSearch">
            <div v-if="showTrending" class="advices-list-wrapper">
                <div class="history">
                    <div class="card-title">
                        搜索历史
                        <i class="el-icon-delete icon-del" @click="delSearchHistory"></i>
                    </div>
                    <div class="history-list">
                        <div class="history-button" v-for="(button, i) in historyList" :key="i">
                            {{button}}
                            <i class="el-icon-close icon-close" @click="delSearchHistory"></i>
                        </div>
                    </div>
                </div>
                <div class="trending">
                    <div class="card-title">
                        热搜榜
                    </div>
                    <div class="trending-list">
                        <div class="list-item" v-for="(item, i) in trendingList" :key="i">
                            <div class="list-item-sort flex-c">{{i + 1}}</div>
                            <div class="item-song-info">
                                <div class="song-wrapper">
                                    <span class="song-title">{{item.searchWord}}</span>
                                    <i class="song-hot" v-if="item.iconUrl">HOT</i>
                                    <span class="song-count">{{item.score}}</span>
                                </div>
                                <div class="song-desc">
                                    {{item.content}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showSearch" class="serch-list-wrapper">
                <div class="serch">
                    <div class="card-title">
                        查询
                    </div>
                    <div class="serch-list">

                    </div>
                </div>
            </div>
        </div>
    </transition>
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
            hasValueReg: /^[\s\S]*.*[^\s][\s\S]*$/,
            keywords: '',
            hotSearchList: null,
            showTrending: false,
            showSearch: false,
            historyList: localStorage.searchHistory ? JSON.parse(localStorage.searchHistory) : [],
            trendingList: []

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
        // 回首页
        tofind() {
            this.$router.push('/find')
        },
        // 检查登录状态
        checkLogin() {
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
        inithotSearch(e){
            const { value } = e.target
            if(this.hasValueReg.test(value)){
                this.showTrending = false
                this.showSearch = true
                this.adviseSearch(value)
            }else{
                this.showSearch = false
                this.showTrending = true
                this.getTrendingList()
            }
        },
        adviseSearch(){
            if(this.hasValueReg.test(this.keywords)){
                this.showSearch = true
                this.showTrending = false
            }else{
                this.showTrending = true
                this.showSearch = false
            }
        },
        setLocalsearch(){
            if(!this.hasValueReg.test(this.keywords)) return
            this.historyList = this.historyList.filter(v => v !== this.keywords);
            this.historyList.splice(0,0,this.keywords)
            localStorage.setItem('searchHistory', JSON.stringify(this.historyList))
        },
        searchAll(){
            this.setLocalsearch()
        },
        delSearchHistory(){
            alert('删除所有')
        },
        getTrendingList(){
            Axios(getHotSearch).then(({data}) => {
                this.trendingList = data
            })
        },
        //听歌识曲
        toMic(){
            console.log(1)
        },
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
            color: #ee7676;
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
.search-list{
    position: absolute;
    top: 48px;
    left: 256px;
    background: #fff;
    border-radius: 6px;
    padding: 3px 0px;
}
.advices-list-wrapper{
    width: 354px;
    height: 450px;
    margin-top: 5px;
    overflow: auto;
    .history{
        .history-list{
            margin: 0 20px;
            .history-button{
                position: relative;
                white-space: nowrap;
                float: left;
                padding: 6px 15px;
                margin-right: 10px;
                margin-bottom: 10px;
                color: #633636;
                border:1px solid #d6d6d6;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                .icon-close{
                    display: inline-flex;
                    position: absolute;
                    font-size: 14px;
                    color: #aaa;
                    top: 6px;
                    right: 2px;
                    display: none
                }
                &:hover{
                    background: rgba(243,243,243, 1);
                    .icon-close{
                        display: block
                    }
                }
            }
        }
    }
    .trending{
        display: inline-block;
        margin-top: 10px;
        width: 100%;
        .trending-list{
            .list-item-sort{
                font-weight: 600;
                color: #e62929d1;
                width: 54px;
            }
            .item-song-info{
                line-height: 22px;
                .song-wrapper{
                    .song-title{
                        color: #313131;
                        font-weight: 600;
                        font-size: 12px;
                    }
                    .song-hot{
                        display: inline-block;
                        font-size: 12px;
                        font-weight: 600;
                        transform: scale(.8);
                        margin-left: 8px;
                        color: #e62929d1
                    }
                    .song-count{
                        margin-left: 8px;
                        color: #d6d6d6;
                        font-size: 12px
                    }
                }
                .song-desc{
                    color: #a9a7a7;
                    font-size: 12px
                }
            }
            
            .list-item{
                display: flex;
                padding: 4px 0;
                cursor: pointer;
                &:hover{
                    background: #f1f1f1
                }
            }
            .list-item:nth-child(n+4) {
                .song-title{
                    font-weight: 500;
                }
                .list-item-sort{
                    color: #d6d6d6;
                    font-weight: 500;
                }
            }
        }
    }
}

.serch-list-wrapper{
    width: 354px;
    margin-top: 5px;
    overflow: auto;
}
.card-title{
    font-size: 14px;
    color: #797474;
    margin: 9px 20px 14px 20px;
    .icon-del{
        cursor: pointer;
        margin-left: 4px;
        font-size: 15px;
    }
}

.fade-enter,.fade-leave-to {
    opacity: 0;
}
.fade-enter-active,.fade-leave-active {
    transition: opacity .2s ease-in;
}
.flex-c{
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
    