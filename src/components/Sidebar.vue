<template>
  <div class="page-wrap">
    <!-- 顶部公告栏 -->
    <div class="announcement-bar" v-if="showAnnouncement">
      <div class="announcement-content">
        <span>欢迎来到我的博客！这里会发布一些最新的公告和动态。</span>
        <button class="close-btn" @click="closeAnnouncement">×</button>
      </div>
    </div>

    <!-- 主体：侧边栏 + 文章区 -->
    <div class="layout">
      <!-- 侧边栏 -->
      <aside class="zhuye" aria-label="sidebar">
        <!-- 头像 + 名称 -->
        <section class="card user-card">
          <div class="avatar-wrap">
            <img
              class="avatar"
              src="https://tu.tianmen15qwq.dpdns.org/file/13d6ccfd6f980350ad23f.jpg"
              alt="avatar"
            />
          </div>
          <div class="user-meta">
            <div class="username">tianmen</div>
            <div class="description">have nothings</div>
          </div>
        </section>

        <!-- 社交图标区 -->
        <section class="card socials iconh1">
          <a
            class="social-link"
            href="https://space.bilibili.com/660045843"
            target="_blank"
            rel="noreferrer"
            aria-label="Bilibili"
          >
            <svg
              class="icon"
              width="4em"
              height="4em"
              fill="currentColor"
              role="img"
              aria-hidden="true"
            >
              <use xlink:href="#ai:fa6-brands:bilibili"></use>
            </svg>
          </a>

          <a
            class="social-link"
            href="https://github.com/tianmen114"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <svg
              class="icon"
              width="4em"
              height="4em"
              fill="currentColor"
              role="img"
              aria-hidden="true"
            >
              <use xlink:href="#ai:fa6-brands:github"></use>
            </svg>
          </a>
        </section>
        <section>
        <div class="card ip-info">        <img src="./ui/github-user-contribution.svg" alt=""></img></div>
        </section>
        <!-- IP 信息板块 -->
        <section class="card ip-info">
          <div class="ip-line">
            <strong>你的IP：</strong> <span>{{ IP.ip || "加载中..." }}</span>
          </div>
          <div class="ip-line">
            <strong>省份：</strong> <span>{{ IP.region || "-" }}</span>
          </div>
          <div class="ip-line">
            <strong>城市：</strong> <span>{{ IP.city || "-" }}</span>
          </div>
        </section>

        <!-- AI 聊天板块（在侧边栏内部） -->
        <section class="card ai-chat">
          <h4 class="ai-title">猫娘选择</h4>
          <select v-model="selectedModel" @change="saveSelectedModel" class="color">
            <option v-for="model in models" :key="model.id" :value="model.id">
              {{ model.id }}
            </option>
          </select>

          <textarea
            v-model="userMessage"
            placeholder="输入你的问题主人喵~ (按Enter发送)"
            @keydown.enter.prevent="sendMessage"
            rows="3"
          ></textarea>

          <div class="ai-actions">
            <button class="btn" :disabled="loading" @click="sendMessage">
              {{ loading ? "生成中喵~" : "发送" }}
            </button>
            <button class="btn ghost" @click="clearChat">清空</button>
          </div>

          <div :class="reply ? 'reply' : 'reply1'">
            <h5>猫娘回复：</h5>
            <p>{{ reply }}</p>
          </div>
        </section>
        <svg xmlns="http://www.w3.org/2000/svg" color="#ffbfd198" style="display: none">
          <symbol id="ai:fa6-brands:bilibili" viewBox="0 0 512 512">
            <path
              fill="#ffbfd198"
              d="M488.6 104.1c16.7 18.1 24.4 39.7 23.3 65.7v202.4c-.4 26.4-9.2 48.1-26.5 65.1c-17.2 17-39.1 25.9-65.5 26.7H92.02c-26.45-.8-48.21-9.8-65.28-27.2C9.682 419.4.767 396.5 0 368.2V169.8c.767-26 9.682-47.6 26.74-65.7C43.81 87.75 65.57 78.77 92.02 78h29.38L96.05 52.19c-5.75-5.73-8.63-13-8.63-21.79c0-8.8 2.88-16.06 8.63-21.797C101.8 2.868 109.1 0 117.9 0q13.2 0 21.9 8.603L213.1 78h88l74.5-69.397C381.7 2.868 389.2 0 398 0q13.2 0 21.9 8.603c5.7 5.737 8.6 12.997 8.6 21.797c0 8.79-2.9 16.06-8.6 21.79L394.6 78h29.3c26.4.77 48 9.75 64.7 26.1m-38.8 69.7c-.4-9.6-3.7-17.4-10.7-23.5c-5.2-6.1-14-9.4-22.7-9.8H96.05c-9.59.4-17.45 3.7-23.58 9.8c-6.14 6.1-9.4 13.9-9.78 23.5v194.4c0 9.2 3.26 17 9.78 23.5s14.38 9.8 23.58 9.8H416.4c9.2 0 17-3.3 23.3-9.8s9.7-14.3 10.1-23.5zm-264.3 42.7c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2c-6.2 6.3-14 9.5-23.6 9.5s-17.5-3.2-23.6-9.5s-9.4-14-9.8-23.2v-33.3c.4-9.1 3.8-16.9 10.1-23.2s13.2-9.6 23.3-10c9.2.4 17 3.7 23.3 10m191.5 0c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2s-14 9.5-23.6 9.5s-17.4-3.2-23.6-9.5c-7-6.3-9.4-14-9.7-23.2v-33.3c.3-9.1 3.7-16.9 10-23.2s14.1-9.6 23.3-10c9.2.4 17 3.7 23.3 10"
            ></path>
          </symbol>
          <symbol id="ai:fa6-brands:github" color="#ffbfd198" viewBox="0 0 496 512">
            <path
              fill="currentColor"
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
            ></path>
          </symbol>
        </svg>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface IpInfo {
  ip?: string;
  region?: string;
  city?: string;
  [k: string]: any;
}

const IP = ref<IpInfo>({});
const showAnnouncement = ref(true);
const ANNOUNCEMENT_VERSION = "v1.0";
async function fetchIP() {
  try {
    const res = await fetch("https://ipinfo.io/json?token=8b1d43f04583d0");
    const data = await res.json();
    IP.value = data;
  } catch (e) {
    console.warn("fetch IP failed", e);
    IP.value = { ip: "未知", region: "-", city: "-" };
  }
}

// AI 聊天相关（保留你的实现逻辑）
interface Model {
  id: string;
  [k: string]: any;
}
const models = ref<Model[]>([]);
const selectedModel = ref("");
const userMessage = ref("");
const reply = ref("");
const loading = ref(false);
const fetchModels = async () => {
  try {
    const res = await fetch("https://api.chatanywhere.tech/v1/models", {
      method: "GET",
      headers: {
        Authorization: "Bearer  sk-Pg4qRM4ZsFpgrpfv6sw2riJRNc55rPQ5er23xlGjcUsIsfPP",
      },
    });
    const result = await res.json();
    if (result.data) models.value = result.data;
  } catch (err) {
    console.error("获取模型列表失败", err);
  }
};

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;
  loading.value = true;
  reply.value = "";
  try {
    const res = await fetch("https://api.chatanywhere.tech/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer  sk-Pg4qRM4ZsFpgrpfv6sw2riJRNc55rPQ5er23xlGjcUsIsfPP",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel.value || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一只可爱的猫娘，说话最多200字，语气可爱，带点喵~",
          },
          { role: "user", content: userMessage.value },
        ],
        max_tokens: 200,
      }),
    });
    const result = await res.json();
    if (result.choices?.length) {
      reply.value = result.choices[0].message.content;
    } else {
      reply.value = "喵呜~没有生成结果呢~";
    }
  } catch (e) {
    console.error(e);
    reply.value = "喵~出错了，请稍后再试~";
  } finally {
    loading.value = false;
  }
};

const saveSelectedModel = () => {
  localStorage.setItem("selectedModel", selectedModel.value);
};
const loadSelectedModel = () => {
  const saved = localStorage.getItem("selectedModel");
  if (saved) selectedModel.value = saved;
};
const clearChat = () => {
  userMessage.value = "";
  reply.value = "";
};

// 公告栏
const closeAnnouncement = () => {
  showAnnouncement.value = false;
  localStorage.setItem("announcementClosed", "true");
};

onMounted(() => {
  const closed = localStorage.getItem("announcementClosed");
  if (closed === "true") showAnnouncement.value = false;

  fetchIP();
  fetchModels();
  loadSelectedModel();
});
</script>

<style scoped>
.page-wrap {
  width: 25vw;
  height: min-content;
  padding: 20px;
  margin-top: 42px;
  background: linear-gradient(
    180deg,
    rgba(252, 252, 253, 0.15),
    rgba(200, 230, 255, 0.06)
  );
  backdrop-filter: blur(40px);
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.announcement-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(#ffbfd198, #a2d8ff6c);
  backdrop-filter: blur(6px);
  color: #fff;
  z-index: 1000;
  padding: 8px 12px;
}
.announcement-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

/* 主布局：侧边栏 + 主体 */
.layout {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
  box-sizing: border-box;
}

/* 侧边栏 */
.zhuye {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(20, 30, 60, 0.06);
  backdrop-filter: blur(8px);
  color: #fff;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 18px 24px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(237, 159, 197, 0.15);
}

.avatar-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  border: 3px solid transparent;
  transition: border-color 0.3s ease;
}

.user-card:hover .avatar-wrap {
  border-color: #ed9fc5;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.avatar:hover {
  transform: scale(1.2) rotate(5deg);
  box-shadow: 0 0 30px rgba(237, 159, 197, 0.9);
  filter: brightness(1.1);
}

.user-meta {
  padding: 0 10px;
}

.user-meta .username {
  font-weight: 800;
  font-size: 1.1rem;
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

.user-meta .username:hover {
  color: #ed9fc5;
}

.user-meta .username::after {
  position: absolute;
  content: "";
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background-color: #ed9fc5;
  transition: transform 0.4s ease;
  transform-origin: center;
}

.username:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.user-meta .description {
  color: #d6e8ff;
  font-size: 0.9rem;
  margin-top: 8px; /* 增加间距 */
  transition: color 0.3s ease;
}

/* 社交 */
.socials {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-around;
}
.social-link {
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
}
.icon {
  opacity: 0.95;
}

/* nihao 模块 */
.nihao-module .module-title {
  font-weight: 700;
  margin-bottom: 8px;
}
.nihao-module .small-btn {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

/* IP 信息 */
.ip-info .ip-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #eef7ff;
  transition: all 0.3s ease;
  position: relative;
}

.ip-info .ip-line::after {
  content: "";
  position: absolute;
  background-color: #ed9fc51d;
  width: 0px;
  height: 0px;
  bottom: 0;
  left: 0px;
  transition: all 0.3s ease;
  z-index: -1;
}

.ip-info .ip-line:hover::after {
  background-color: #ed9fc5bd;
  width: 100%;
  height: 20px;
}

.ip-info .ip-line:hover {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 6px;
  transition: all 0.3s ease;
}

/* AI 聊天卡片 */
.ai-chat select,
.ai-chat textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px;
  margin-bottom: 8px;
  background: #ed9fc538;
  color: #ed9fc5;
  box-sizing: border-box;
}
.ai-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-bottom: 8px;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, #ff9bb0, #63f3ff);
  color: #0b2340;
  font-weight: 700;
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}
.ai-reply h5 {
  margin: 0 0 6px 0;
  color: #ffd6e3;
}

/* 主内容区（文章列表占位） */
.main-content {
  flex: 1;
  min-height: 60vh;
}
.simple-article-list {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  color: #0b0b0b;
  min-height: 200px;
}
/* 响应式 */
@media (max-width: 900px) {
  .layout {
    gap: 12px;
    padding: 0 8px;
  }
  .zhuye {
    width: 280px;
  }
}
@media (max-width: 680px) {
  .layout {
    flex-direction: column;
  }
  .zhuye {
    width: 100%;
  }
  .main-content {
    order: 2;
  }
}
/* 布局 */
.socials {
  display: flex;
  gap: 18px;
  align-items: center;
  padding: 12px;
}
.social-link {
  transition: all 0.3s ease;
}
.social-link:hover,
.social-link:focus-visible {
  transform: perspective(900px) translateZ(22px) translateY(-8px) scale(1.06);
  filter: saturate(1.08) contrast(1.02);
}
.reply {
  padding: 10px;
  background: #ffffff26;
  border: 3px solid #dddddd6b;
  border-radius: 40px;
  width: 200px;
  backdrop-filter: blur(20px);
  transition: all 0.8s ease;
  padding: 20px;
  width: auto;
}
.reply:hover {
  border: 3px solid #8ec2fa;
  transition: all 0.3s ease;
}
.reply1 {
  padding: 10px;
  background: #ffffff8a;
  border: 3px solid #ddd;
  border-radius: 40px;
  width: 200px;
  transition: all 0.8s ease;
  opacity: 0;
}
</style>
