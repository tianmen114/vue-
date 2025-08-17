import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/base.css';
import './assets/markdown-themes.css';

const pinia = createPinia(); // 创建 Pinia 实例
const app = createApp(App); // 创建 Vue 应用实例

app.use(pinia); // 安装 Pinia
app.use(router); // 安装路由器
app.mount('#app'); // 挂载应用
