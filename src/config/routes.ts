/**
 * 路由入口
 * @author LiQingSong
 */


import { createRouter, createWebHashHistory } from 'vue-router';
import { RoutesDataItem } from "@/utils/routes";

import SecurityLayout from '@/layouts/SecurityLayout.vue';

import IndexLayoutRoutes from '@/layouts/IndexLayout/routes';
import IndexLayout from '@/layouts/IndexLayout/index.vue';

import UserLayoutRoutes from '@/layouts/UserLayout/routes';
import UserLayout from '@/layouts/UserLayout/index.vue';

// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const routes: Array<RoutesDataItem> = [
  {
    title: 'empty',
    path: '/',
    component: SecurityLayout,
    children: [
      {
        title: 'empty',
        path: '/',
        redirect: '/home/workplace',
        component: IndexLayout,
        children: IndexLayoutRoutes
      },
    ]
  },
  {
    title: 'empty',
    path: '/user',
    redirect: '/user/login',
    component: UserLayout,
    children: UserLayoutRoutes
  },
  {
    title: 'app.global.menu.notfound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  }
]

const router = createRouter({
  scrollBehavior(/* to, from, savedPosition */) {
    return { top: 0 }
  },
  history: createWebHashHistory(process.env.BASE_URL),
  routes: routes as any,
});
// router.beforeEach((to, from, next) => {
//   NProgress.start() // 显示进度条
//   next()
// })

// router.afterEach(() => {
//   NProgress.done() // 完成进度条
// })

export default router;
