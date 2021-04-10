<!-- 
 * Author       : Zhao Dongxu
 * Desc         :  
 * Date         : 2021-03-17 15:51:55
 * LastEditors  : Zhao Dongxu
 * LastEditTime : 2021-04-09 18:00:48
 * FilePath     : \src\views\netease\dashboard\player.vue
 -->
<template>
  <div class="player-wrapper">
    <div class="song-info-wrapper">
      <div class="song-info-left">
        <div class="song-pic">
          <img src="../../../assets/images/center.jpg" alt="">
          <i class="el-icon-m-fangda enlarge"></i>
        </div>
        <div class="song-info">
          <div class="song-title">直到世界的尽头时代峰峻乐山大佛</div>
          <div class="song-album">上杉升</div>
        </div>
        <div class="song-collect" @click="collect = !collect"><i :class="collect ? 'el-icon-m-heart': 'el-icon-m-heart-fill'"></i></div>
      </div>
      
      <div class="song-info-center">
        <div class="play-control">
          <i :class="[modeClass]" class="play-type" @click="switchPlayType()"></i>
          <!-- <i class="el-icon-m-step-backward prev"></i> -->
          <i class="el-icon-m-step-backward prev"></i>
          <i :class="animate ? 'el-icon-m-pause' : 'el-icon-caret-right'" class=" paly-class play" @click="play()"></i>
          <i class="el-icon-m-step-forward next"></i>
          <!-- <i class="el-icon-m-step-forward next"></i> -->
          <i class="el-icon-m-ci play-ci"></i>
        </div>
        <div class="play-progress" @click="toTime" ref="timeContainer">
          <div class="play-time-used">{{format(time)}}</div>
          <div class="play-line">
            <div class="play-line-used" :style="{width: (audio.currentTime/audio.duration * 100) + '%'}"></div>
            <div class="play-line-point" :style="{left: (audio.currentTime/audio.duration * 100)-1 + '%' }" @mousedown.stop="drap"></div>
          </div>
          <div class="play-duration">{{duration}}</div>
        </div>
      </div>
      <div class="song-info-right">
        <!-- <div class="playControl">
          <i class="iconfont icon-shangyishou prev"></i>
          <i class="iconfont icon-icon-test1 prev"></i>
          <i class="el-icon-caret-right paly-class play"></i>
          <i class="iconfont icon-xiayishou next"></i>
          <i class="iconfont icon-icon-test1 next"></i>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const offSetLeft = 250
const boxWidth = 12

export default {
  name: 'Player',
  data(){
    const playTypeOpts = {
      1: 'el-icon-m-liebiaoxunhuan',
      2: 'el-icon-m-loop',
      3: 'el-icon-m-suijibofang-wangyiicon',
      4: 'el-icon-m-shunxubofang',
    }
    return {
      collect: false,
      playTypeOpts,
      playType: 1,
      audio: null,
      animate: false,
      duration: null,
      timeWidth: 0,
      timer: null,
      time: 0,
      currentSong: {
        url: 'http://m10.music.126.net/20210409175009/7c68d4e1ba43f6859ff5b2e467fa6f22/yyaac/obj/wonDkMOGw6XDiTHCmMOi/2270178263/fa92/1886/c282/fe84531951856644fa9285e2f3214b46.m4a'
      }
    }
  },
  computed: {
    modeClass() {
      return this.playTypeOpts[this.playType]
    },
  },
  watch: {
    // 'audio.currentTime'(newVal) {
    //   console.log(newVal)
    // },
  },
  created(){
    console.log(this.$store)
    this.init()
  },
  methods: {
    async init() {
      this.audio = new Audio()
      this.audio.src = this.currentSong.url
      // //  设置进度条的宽度
      // this.timeWidth = this.$refs.timeContainer ? this.$refs.timeContainer.offsetWidth : 0

      this.audio.addEventListener('canplaythrough', () => {
        const { duration } = this.audio
        if (duration === Infinity) {
          this.audio.currentTime = 1e101
          this.audio.ontimeupdate = function() {
            // this.ontimeupdate = () => {
            //   return
            // }
            if (this.audio) this.audio.currentTime = 0
            return
          }
        }
        this.duration = this.format(this.audio.duration)
      })
      this.audio.onplay = () => {
        this.animate = true
        this.playerStart()
      }
      this.audio.onpause = () => {
        this.animate = false
        this.playerStop()
      }
      this.audio.onended = () => {
        this.animate = false
      }
      window.audioList = window.audioList || []
      window.audioList.push(this.audio)// 所有实例加入全局变量
    },
    switchPlayType(){
      const len = Object.keys(this.playTypeOpts).length
      if(this.playType > len-1){
        this.playType = 1
      }else{
        this.playType ++ 
      }
    },
    playerStop(){
        clearInterval(this.timer);
        this.timer = null;
    },
    playerStart(){
      const count = () => {
        const { currentTime = 0 } = this.audio
        this.time =  Math.floor(currentTime) + 1
      }
      if (!this.timer) {
        if(this.time > 0) count();
        this.timer = setInterval(count, 1000);
      }
    },
    play() {
      if (this.audio.paused) {
        window.audioList.forEach(audio => { // 开始前先关闭所有可能正在运行的实例
          audio.pause()
        })
        this.playerStart()
        this.audio.play()
      } else {
        console.log('暂停中')
        this.playerStop()
        this.audio.pause()
      }
    },
    format(s) {
      let t = ''
      if (s > -1) {
        const min = Math.floor(s / 60) % 60
        const sec = s % 60
        if (min < 10) { t += '0' }
        t += min + "'"
        if (sec < 10) { t += '0' }
        t += sec.toFixed()
      }
      return t
    },
    toTime(e){
      e.stopPropagation()
      const { layerX } = e
      console.log('line----', layerX, e)
      
    },
    drap(e){
      e.stopPropagation()
      if(!this.duration) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      let moveX = 0
      function move(e) {
        e.stopPropagation()
        moveX = e.clientX - offSetLeft - boxWidth/2
        if(e.clientX - offSetLeft >= _this.timeWidth) {
         _this.time = _this.timeWidth - boxWidth/2
         moveX = 0
        }else if(e.clientX - offSetLeft <= 0) {
          moveX = 0 - boxWidth/2
        }else {
          _this.time = moveX
          _this.$refs.audio.currentTime = _this.time / _this.timeWidth * _this.currentSong.duration / 1000
        }  
        console.log(moveX)
      }
      document.addEventListener('mousemove',move)

      document.addEventListener('mouseup',function (e) {
        e.stopPropagation()
        document.removeEventListener("mousemove",move)
      })
      
    },
  }
}
</script>

<style scoped lang="scss">
.player-wrapper{
  position: fixed;
  width: 100%;
  height: 72px;
  bottom: 0;
  z-index: 100000;
  border-top: 1px solid rgb(223, 220, 220);
  background: #f2f2f2;
  
  .song-info-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    i{
      color: #222;
      cursor: pointer;
      &:hover{
        color: #ff1a1ad1
      }
    }
    .song-info-left{
      display: flex;
      align-items: center;
      
      .song-pic{
        width: 50px;
        height: 50px;
        margin: 11px;
        position: relative;
        // background: #ccc;
        cursor: pointer;
        // overflow: hidden;
        .enlarge{
          width: 34px;
          height: 34px;
          opacity: 0;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -17px;
          margin-top: -17px;
          font-size: 34px;
          color: #fff;
          transition: all .5s;
        }
        img{
          width: 50px;
          height: 50px;
          border-radius: 5px;
          overflow: hidden;
        }
        &:hover{
          img{
            -webkit-filter: blur(1.5px);
            -moz-filter: blur(1.5px);
            -ms-filter: blur(1.5px);
              filter: blur(1.5px);
          }
          .enlarge{
            opacity: 1;
            font-size: 34px;
          }
        }
      }
      .song-info{
        line-height: 24px;
        width: 142px;
        .song-album, .song-title{
          color: #444;
          font-size: 15px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .song-title{
          &:hover{
            color: #000
          }
        }
        .song-album{
          font-size: 14px;
        }
        
      }
      .song-collect{
        height: 40px;
        // margin-left: 5px;
        .el-icon-m-heart{
          color: rgb(177, 174, 174);
          font-size: 20px;
          &:hover{
            color: #ff1a1ad1
          }
        }
        .el-icon-m-heart-fill{
          color: #ff1a1ad1
        }
      }
    }
    
    .song-info-center{
      position: absolute;
      left: 50%;
      margin-left: -229px;
      width: 458px;
      .play-control{
        width: 222px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        i{
          color: #222;
          cursor: pointer;
          &:hover{
            color: #ff1a1ad1
          }
        }
        .play-type{
          font-size: 14px;
        }
        .play-ci{
          font-size: 14px;
        }
        .paly-class{
          border-radius: 50%;
          background: #e6e6e6;
          &:hover{
            background: #d2d2d2;
            color: #222
          }
        }
        .el-icon-m-pause{
          padding: 7px;
          font-size: 20px;
        }
        .el-icon-caret-right{
          font-size: 24px;
          padding: 5px;
        }
      }
      .play-progress{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 10px;
        margin-top: 5px;
        .play-time-used, .play-duration{
          color: #ccc;
          font-size: 12px;
          margin: 0 4px;
        };
        .play-line{
          position: relative;
          height: 3px;
          border-radius: 2px;
          width: 100%;
          background: #ccc;
          cursor: pointer;
          &:hover{
            height: 5px;
            .play-line-point{
              display: block;
            };
            .play-line-used{
              transform: scaleY(1.3);
            }
          }
          .play-line-used{
            height: 3px;
            position: absolute;
            border-radius: 3px;
            width: 50px;
            left: 0;
            top: 0;
            background: red;
            transition: all .2s;
          };
          .play-line-point{
            width: 9px;
            height: 9px;
            position: absolute;
            border-radius: 50%;
            left: 46px;
            top: -3px;
            background: red;
            display: none;
          }
        }
      }
    }
    .song-info-right{
      
    }
    
  }
  i{
    cursor: pointer;
  }
}
.font23{
  font-size: 23px!important;
}
</style>