import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import search from '@/components/MySearch.vue'
import MdArticleDetail from '@/components/MdArticleDetail.vue'
import home from '@/components/home.vue'
import picture from '@/components/picture.vue'
import dongman from '@/components/dongman.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: home },
  { path: '/search', component: search },
  { path: '/picture', component: picture },
  { path: '/article/:id', name: 'article', component: MdArticleDetail, props: true },
  { path: '/archive', name: 'archive', component: () => import('@/components/Archive.vue') },
  { path: '/about', name: 'about', component: () => import('@/components/About.vue') },
  { path: '/dongman', name: 'dongman', component: dongman } // 修正 name
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' }
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// 全局路由守卫：切换路由显示进度条
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

// 全局路由守卫：路由切换完成后结束进度条
router.afterEach(() => {
  NProgress.done()
})

export default router
