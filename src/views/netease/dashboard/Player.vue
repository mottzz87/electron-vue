<!-- 
 * Author       : Zhao Dongxu
 * Desc         :  
 * Date         : 2021-03-17 15:51:55
 * LastEditors  : Zhao Dongxu
 * LastEditTime : 2021-03-17 19:05:19
 * FilePath     : \src\views\netease\dashboard\player.vue
 -->
<template>
  <div class="player-wrapper">
    <div class="song-info-wrapper">
      <div class="song-pic">
        <img src="" alt="">
      </div>
      <div class="song-info">
        <div class="song-title">直到世界的尽头时代峰峻乐山大佛</div>
        <div class="song-album">上杉升</div>
      </div>
      <div class="song-collect"><i class="el-icon-star-off"></i></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Player',
  methods:{
    
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
    .song-pic{
      width: 50px;
      height: 50px;
      margin: 11px;
      border-radius: 5px;
      background: #ccc;
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
      margin-left: 15px;
      i{
        color: rgb(145, 145, 145);
        font-size: 20px;
      }
    }
    
  }
  .song-pic, .song-title, .song-album, .song-collect i{
    cursor: pointer;
  }
}
</style>