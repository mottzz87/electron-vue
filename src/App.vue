<!-- 
 * Author       : Zhao Dongxu
 * Desc         :  
 * Date         : 2021-03-09 16:48:33
 * LastEditors  : Zhao Dongxu
 * LastEditTime : 2021-03-17 17:33:21
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
