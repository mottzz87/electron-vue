/*
 * @Author       : Zhao Dongxu
 * @Desc         :  
 * @Date         : 2021-03-09 16:48:33
 * @LastEditors  : Zhao Dongxu
 * @LastEditTime : 2021-04-08 09:22:54
 * @FilePath     : \src\main.ts
 */
import { createApp } from 'vue';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';
// import '//at.alicdn.com/t/font_2471506_5zfddt42ulu.css';

// 引入 ElementUI
import ElementPlus from 'element-plus';

// 导入 svg
import { importAllSvg } from "@/components/IconSvg/index";
importAllSvg();

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n, { elementPlusMessages } from '@/config/i18n';

const app = createApp(App)
app.use(store);
app.use(router)
app.use(ElementPlus, { size: 'small', locale: elementPlusMessages[i18n.global.locale.value] });
app.use(i18n);
app.mount('#app');