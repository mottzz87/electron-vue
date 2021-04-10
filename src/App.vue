<!-- 
 * Author       : Zhao Dongxu
 * Desc         :  
 * Date         : 2021-03-09 16:48:33
 * LastEditors  : Zhao Dongxu
 * LastEditTime : 2021-04-08 11:27:21
 * FilePath     : \src\App.vue
 -->
<template>
  <div id="app">
    <router-view></router-view>
    <player></player>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Player from './views/netease/dashboard/Player.vue'
import { setHtmlLang } from "@/utils/i18n";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: 'App',
  components: {
    Player
  },
  setup() {
    const { locale } = useI18n();

    onMounted(() => {
      setHtmlLang(locale.value);
    })
    
  }
})
</script>
<style>
  @import "//at.alicdn.com/t/font_2471506_fyk9mmwl30q.css";

  [class^="el-icon-m"], [class^=" el-icon-m"] {
    font-family: "iconfont", serif !important;
    font-size: 20px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>