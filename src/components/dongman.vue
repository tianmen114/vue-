<template>
  <div class="dongman-page">
    <bilibili-bangumi
      api="https://bil.tianmen15qwq.dpdns.org/api"
      bilibili-uid="660045843"
      class="tianmen"
    ></bilibili-bangumi>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { defineCustomElements } from "bilibili-bangumi-component/loader";
defineCustomElements();

function injectShadowStyle() {
  const el = document.querySelector("bilibili-bangumi") as HTMLElement | null;
  if (!el) return false;
  const sr = (el as any).shadowRoot as ShadowRoot | null;
  if (!sr) return false;

  // 防止重复注入
  if (sr.getElementById("my-bbc-style")) return true;

  const style = document.createElement("style");
  style.id = "my-bbc-style";
  style.textContent = `

    .bbc-bangumi-title a:hover {
      color: #63f3ff;
    }
.bbc-bangumi-title a:hover {
  color: #85e3ff;
}

.bbc-bangumi-title a {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.bbc-bangumi-title a:hover::after {
  width: 100%;
}

.bbc-bangumi-title a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 100%;
  background-color: #435af0;
  z-index: -1;
  transition: all 0.4s ease;
  border-radius: 8px;
}

  `;
  sr.appendChild(style);
  return true;
}

onMounted(() => {
  // 立即尝试注入（如果组件已挂载）
  if (!injectShadowStyle()) {
    // 如果组件稍后挂载（异步渲染），用 MutationObserver 监听并注入
    const mo = new MutationObserver(() => {
      if (injectShadowStyle()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
});
</script>

<style scoped>
.dongman-page {
  padding: 1em;
  margin: 10px 30px;
  display: flex;
  justify-content: center;
}

.tianmen {
  width: 900px;
  font-size: 14px;
  border-radius: 20px;
  background: rgba(67, 90, 240, 0.132);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  transition: all 0.3s ease;
}



tianmen-bangumi::part(container) {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
bilibili-bangumi::part(title) {
  color: #fff;
}

bilibili-bangumi::part(title):hover {
  color: #00ffff;
}
</style>
