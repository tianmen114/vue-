import { createRouter, createWebHistory } from 'vue-router'
import search from '@/components/MySearch.vue'
import MdArticleDetail from '@/components/MdArticleDetail.vue'
import home from '@/components/home.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: home },
  { path: '/search', component: search },
  { path: '/article/:id', name: 'article', component: MdArticleDetail, props: true },
  { path: '/archive', name: 'archive', component: () => import('@/components/Archive.vue') },
  { path: '/about', name: 'about', component: () => import('@/components/About.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' }
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // 默认情况下平滑滚动到顶部
    return { top: 0, behavior: 'smooth' }
  }
})


export default router
