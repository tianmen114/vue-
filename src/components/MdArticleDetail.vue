<template>
  <div class="guodu">
    <div class="md-article-detail">
      <div v-if="article" class="article-container">
        <!-- 文章头部 -->
        <div class="article-header">
          <!-- 调试信息 -->
          <div
            v-if="article.cover"
            style="
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0, 0, 0, 0);
              color: white;
              padding: 5px;
              border-radius: 5px;
              font-size: 12px;
              z-index: 10;
            "
          ></div>
          <img
            v-if="article.cover"
            :src="article.cover"
            :alt="article.title"
            class="header-bg-image"
            @error="handleImageError"
          />
          <img v-else src="/sword.png" :alt="article.title" class="header-bg-image" />
          <div class="header-top">
            <Button variant="outline" @click="goBack" class="back-btn"> ← 返回 </Button>
            <div class="theme-selector">
              <Button
                v-for="theme in themes"
                :key="theme.value"
                :variant="currentTheme === theme.value ? 'default' : 'outline'"
                @click="changeTheme(theme.value)"
                class="theme-btn"
              >
                {{ theme.label }}
              </Button>
            </div>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <p>
            {{
              article.title.replace(/\s+/g, "").length +
              article.description.replace(/\s+/g, "").length +
              article.content.replace(/\s+/g, "").length +
              " 字"
            }}
          </p>
          <div class="article-meta">
            <span class="date">{{ formatDate(article.date) }}</span>
            <div class="tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          :class="`markdown-theme-${currentTheme}`"
          v-html="renderedContent"
        ></div>

        <!-- 文章底部 -->
        <div class="article-footer">
          <div class="article-tags">
            <div class="foot">
              <h1>&nbsp;&nbsp;{{ article.title }}</h1>
              <a :href="url">&nbsp;&nbsp;&nbsp;&nbsp;{{ url }}</a>
              <h1>&nbsp;&nbsp;作者:tianmen</h1>
              <h1>&nbsp;&nbsp;时间:{{ formatDate(article.date) }}</h1>
            </div>
            <h3>标签:</h3>
            <div class="tag-list">
              <span v-for="tag in article.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="article-navigation">
            <Button
              v-if="prevArticle"
              variant="outline"
              @click="goToArticle(prevArticle.id)"
            >
              ← {{ prevArticle.title }}
            </Button>
            <Button
              v-if="nextArticle"
              variant="outline"
              @click="goToArticle(nextArticle.id)"
            >
              {{ nextArticle.title }} →
            </Button>
          </div>
        </div>
        <div class="pingl">
          <twikoo />
        </div>
      </div>

      <div v-else class="loading">
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { getMdFileById, mdFiles, loadAllMdFiles, loadMdFile } from "@/utils/mdLoader";
import CodeCopy from "./CodeCopy.vue";
import { Label } from "reka-ui";
import VueLazyload from "vue-lazyload-next";
import twikoo from "./twikoo.vue";
const route = useRoute();
const router = useRouter();
const article = ref<any>(null);
const currentTheme = ref("pink");
const url = ref("");

// 页面加载时获取地址
onMounted(() => {
  url.value = window.location.href;
});

// 监听路由变化自动更新
watch(route, () => {
  url.value = window.location.href;
});
// 主题配置
const themes = [
  { label: "浅色", value: "default" },
  { label: "深色", value: "dark" },
  { label: "粉色", value: "pink" },
  { label: "海洋", value: "teal" },
];

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!article.value || !article.value.content) return "";

  // 自定义渲染器来处理代码块和链接
  const renderer = new marked.Renderer();

  // 暂时移除标题ID功能，避免TypeScript错误

  renderer.code = function (code: any, language?: string) {
    const codeText = typeof code === "string" ? code : code.text || "";
    const lang = language || "text";

    // 生成唯一的ID用于存储代码内容
    const codeId = "code_" + Math.random().toString(36).substr(2, 9);

    // 将代码内容存储到全局变量中，避免在HTML中直接嵌入
    if (typeof window !== "undefined") {
      (window as any).codeStorage = (window as any).codeStorage || {};
      (window as any).codeStorage[codeId] = codeText;
    }

    return `
      <div class="code-block-wrapper">
        <div class="code-header">
          <span class="language-label">${lang}</span>
          <button class="copy-button" onclick="copyCodeBlock(this, '${codeId}')" title="复制代码">
            <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <div class="code-content">
          <pre><code class="language-${lang}">${codeText}</code></pre>
        </div>
      </div>
    `;
  };

  // 处理链接，支持img:前缀显示图片
  renderer.link = function ({
    href,
    title,
    text,
  }: {
    href: string;
    title?: string | null;
    text: string;
  }) {
    // 检查是否以img:开头
    if (href && href.startsWith("img:")) {
      const imageUrl = href.substring(4); // 去掉"img:"前缀
      return `
        <div class="markdown-image-container">
          <img src="${imageUrl}" alt="${text || "Image"}" class="markdown-image" />
          ${text ? `<p class="markdown-image-caption">${text}</p>` : ""}
        </div>
      `;
    }
    // 默认链接处理
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  marked.use({ renderer });

  return marked(article.value.content);
});

// 获取上一篇文章
const prevArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = mdFiles.value.findIndex((f) => f.id === article.value.id);
  if (currentIndex > 0) {
    return mdFiles.value[currentIndex - 1];
  }
  return null;
});

// 获取下一篇文章
const nextArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = mdFiles.value.findIndex((f) => f.id === article.value.id);
  if (currentIndex < mdFiles.value.length - 1) {
    return mdFiles.value[currentIndex + 1];
  }
  return null;
});

// 格式化日期（到分钟，24 小时制）
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// 返回上一页
function goBack() {
  router.back();
}

// 跳转到指定文章
function goToArticle(id: string) {
  router.push(`/article/${id}`);
  // 自动回到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 切换主题
function changeTheme(theme: string) {
  currentTheme.value = theme;
}

// 处理图片加载错误
function handleImageError(event: Event) {
  console.error("封面图片加载失败:", (event.target as HTMLImageElement).src);
  // 可以在这里设置默认图片
}

// 加载文章
async function loadArticle() {
  const articleId = route.params.id as string;
  let foundArticle = getMdFileById(articleId);

  if (foundArticle) {
    article.value = foundArticle;
    return;
  }

  // 若列表尚未加载，先尝试加载所有文章
  if (mdFiles.value.length === 0) {
    await loadAllMdFiles();
    foundArticle = getMdFileById(articleId);
    if (foundArticle) {
      article.value = foundArticle;
      return;
    }
  }

  // 兜底：直接按约定路径尝试加载单文件（如 /md/nihao.md）
  try {
    const direct = await loadMdFile(`/md/${articleId}.md`);
    // 合并到全局列表，避免后续再次加载
    mdFiles.value = [...mdFiles.value.filter((f) => f.id !== direct.id), direct];
    article.value = direct;
    return;
  } catch (e) {
    // 忽略错误，走回退
  }

  // 找不到则返回文章列表
  router.push("/articles");
}

// 添加复制代码的全局函数
const addCopyFunction = () => {
  if (typeof window !== "undefined") {
    (window as any).copyCodeBlock = function (button: HTMLElement, codeId: string) {
      // 防止重复点击
      if (button.classList.contains("copying")) {
        return;
      }

      button.classList.add("copying");

      const copyIcon = button.querySelector(".copy-icon");
      let checkIcon = button.querySelector(".check-icon");

      // 创建检查图标（如果不存在）
      if (!checkIcon) {
        checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        checkIcon.setAttribute("viewBox", "0 0 24 24");
        checkIcon.setAttribute("fill", "none");
        checkIcon.setAttribute("stroke", "currentColor");
        checkIcon.classList.add("check-icon");
        (checkIcon as HTMLElement).style.display = "none";
        checkIcon.innerHTML = '<polyline points="20,6 9,17 4,12"></polyline>';
        button.appendChild(checkIcon);
      }

      // 从全局存储中获取代码内容
      const codeToCopy = (window as any).codeStorage?.[codeId] || "";

      // 复制代码
      const copyToClipboard = async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeToCopy);
            return true;
          } else {
            // 降级方案
            const textArea = document.createElement("textarea");
            textArea.value = codeToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand("copy");
            document.body.removeChild(textArea);
            return result;
          }
        } catch (error) {
          console.error("复制失败:", error);
          return false;
        }
      };

      copyToClipboard().then((success) => {
        if (success) {
          // 显示成功状态
          button.classList.add("copied");
          if (copyIcon) (copyIcon as HTMLElement).style.display = "none";
          if (checkIcon) (checkIcon as HTMLElement).style.display = "block";

          // 2秒后恢复
          setTimeout(() => {
            button.classList.remove("copied", "copying");
            if (copyIcon) (copyIcon as HTMLElement).style.display = "block";
            if (checkIcon) (checkIcon as HTMLElement).style.display = "none";
          }, 2000);
        } else {
          // 复制失败
          button.classList.remove("copying");
          // 可以添加一个短暂的错误提示
          button.style.backgroundColor = "#ef4444";
          setTimeout(() => {
            button.style.backgroundColor = "";
            button.classList.remove("copying");
          }, 1000);
        }
      });
    };
  }
};

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    loadArticle();
  }
);

onMounted(() => {
  loadArticle();
  addCopyFunction();
});

// // 图片跟随效果
// function setupImageFollowEffect() {
//   const wrap = document.querySelector('.article-header')
//   if (!wrap) return

//   const img = wrap.querySelector('img')
//   if (!img) return

//   // 参数
//   const maxMove = 18
//   const scaleActive = 1.08
//   const follow = 0.06
//   const scaleFollow = 0.08

//   let inside = false
//   let targetX = 0, targetY = 0, targetS = 1
//   let currX = 0, currY = 0, currS = 1

//   function tick() {
//     currX += (targetX - currX) * follow
//     currY += (targetY - currY) * follow
//     currS += (targetS - currS) * scaleFollow

//     if (img) {
//       img.style.transform = `translate3d(${currX}px, ${currY}px, 0) scale(${currS})`
//     }
//     requestAnimationFrame(tick)
//   }

//   tick()

//   wrap.addEventListener('pointerenter', () => {
//     inside = true
//   })

//   wrap.addEventListener('pointermove', (e: Event) => {
//     if (!inside) return
//     const pointerEvent = e as PointerEvent
//     const r = wrap.getBoundingClientRect()
//     const nx = (pointerEvent.clientX - r.left) / r.width - 0.5
//     const ny = (pointerEvent.clientY - r.top) / r.height - 0.5
//     targetX = -(nx * 2) * maxMove
//     targetY = -(ny * 2) * maxMove
//     targetS = scaleActive
//   })

//   wrap.addEventListener('pointerleave', () => {
//     inside = false
//     targetX = 0
//     targetY = 0
//     targetS = 1
//   })
// }
</script>

<style scoped>
.md-article-detail {
  min-width: 900px;
  max-width: 900px;
  margin: 15px 0px 0px 15px;
  padding: 1rem;
}

.article-container {
  border-radius: 20px;
  background: #99ccffdf;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.article-header {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  color: #64deff98;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
}

.header-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate3d(0, 0, 0) scale(1);
  will-change: transform;
  pointer-events: none;
  user-select: none;
  z-index: -1;
  transition: all 0.4s ease;
}

.article-header:hover {
  transform: scale(1.05);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.theme-selector {
  display: flex;
  gap: 0.5rem;
}

.theme-btn {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.theme-btn[data-variant="default"] {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
}

.back-btn {
  border-radius: 20px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  backdrop-filter: blur(10px);
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.date {
  font-size: 1rem;
  opacity: 0.9;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  color: #2d3748;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(168, 237, 234, 0.3);
}

.article-content {
  padding: 1rem;
  line-height: 1.8;
  font-size: 1.1rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  border-radius: 20px;
  margin: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-footer {
  padding: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
  border-radius: 20px;
  margin: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.article-tags {
  margin-bottom: 2rem;
}
.article-tags a {
  color: #ff9a9e;
}
.article-tags h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.tag-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-list .tag {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.article-navigation .btn {
  flex: 1;
  max-width: 200px;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

/* Markdown图片样式 */
.markdown-image-container {
  text-align: center;
  margin: 1.5rem 0;
}

.markdown-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.markdown-image-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

/* 移除旧的Markdown样式，使用新的主题系统 */

@media (max-width: 768px) {
  .md-article-detail {
    padding: 1rem;
  }

  .article-header {
    padding: 1.5rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .theme-selector {
    flex-wrap: wrap;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-content {
    padding: 1.5rem;
    font-size: 1rem;
  }

  .article-footer {
    padding: 1.5rem;
  }

  .article-navigation {
    flex-direction: column;
  }

  .article-navigation .btn {
    max-width: none;
  }
}
/* foot */
.foot {
  position: relative;
  height: 170px;
  background: #a1d2ff51;
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(255, 182, 193, 0.3); /* 二次元柔光感 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.foot h1 {
  position: relative;
  font-size: 20px;
  top: 10px;
  left: 20px;
  color: #ffcaca;
  font-family: "Comic Sans MS", "Microsoft YaHei", sans-serif; /* 萌系字体 */
}

.foot a {
  position: relative;
  color: #4dcfff;
  text-decoration: none;
  display: inline-block;

  padding: 5px 10px;
  font-weight: bold;
  font-family: "Comic Sans MS", "Microsoft YaHei", sans-serif;
}

.foot a::after {
  content: "";
  position: absolute;
  left: 8%;
  bottom: 0;
  width: 0;
  width: 0px;
  height: 100%;
  background-color: #ffe066;
  z-index: -1;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.foot a:hover::after {
  width: 90%;
}
.foot h1::after {
  content: "";
  position: absolute;
  left: 8%;
  bottom: 0;
  width: 0;
  width: 0px;
  height: 100%;
  background-color: #ffe066;
  z-index: -1;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.foot h1:hover::after {
  width: 100%;
}
</style>
