import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/base.css';
import './assets/markdown-themes.css';
import VueLazyload from 'vue-lazyload-next';
import '@/assets/style.css'
import { ref } from 'vue';
export const loading = ref(false);

const pinia = createPinia(); // 创建 Pinia 实例
const app = createApp(App);  // 创建 Vue 应用实例

app.use(pinia); // 安装 Pinia
app.use(router); // 安装路由
app.use(VueLazyload, {       // 安装懒加载插件
  loading: '/images/loading.gif', // 占位图
  error: '/images/error.png'      // 加载失败显示
});

app.mount('#app'); // 挂载应用
