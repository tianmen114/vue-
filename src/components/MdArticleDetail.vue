<template>
  <div class="guodu" ref="guoduRef">
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
        <div class="ai">
        <div class="ai1">猫娘摘要:{{ reply }}</div>
        <button class="ai3" @click="sendMessage">摘要</button>
        </div>
        <div
          class="article-content markdown-body"
          :class="`markdown-theme-${currentTheme}`"
          v-html="renderedContent"
        ></div>

        <!-- 图片放大模态框 -->
        <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
          <div class="modal-content" @click.stop>
            <img :src="selectedImage" alt="放大图片" />
            <button class="close-btn" @click="closeImageModal">×</button>
          </div>
        </div>

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
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { getMdFileById, getMdFileByTitle, mdFiles, loadAllMdFiles, loadMdFile } from "@/utils/mdLoader";
import twikoo from "./twikoo.vue";

const route = useRoute();
const router = useRouter();

const article = ref<any>(null);
const currentTheme = ref("pink");
const url = ref("");
const guoduRef = ref<HTMLDivElement | null>(null);

// 图片放大相关
const showImageModal = ref(false);
const selectedImage = ref("");

// 页面加载时获取当前地址
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

// Markdown 渲染
const renderedContent = computed(() => {
  if (!article.value?.content) return "";

  const renderer = new marked.Renderer();

  // 自定义图片渲染，支持点击放大
  renderer.image = function ({ href, title, text }: { href: string; title: string | null; text: string }) {
    return `
      <div class="image-container">
        <img src="${href}" alt="${text || ''}" title="${title || ''}" onclick="openImageModal('${href}')" class="clickable-image" />
        ${text ? `<p class="image-caption">${text}</p>` : ''}
      </div>
    `;
  };

  // 自定义代码块渲染，添加行号和展开/收起功能
  renderer.code = function (code: any, language?: string) {
    const codeText = typeof code === "string" ? code : code.text || "";
    const lang = language || "text";
    const codeId = "code_" + Math.random().toString(36).substr(2, 9);
    
    // 判断代码是否过长需要折叠（例如超过20行）
    const lines = codeText.split('\n');
    const shouldCollapse = lines.length > 20;
    const displayLines = shouldCollapse ? lines.slice(0, 15).join('\n') : codeText;

    // HTML 转义函数
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "\u0026amp;")
        .replace(/</g, "\u0026lt;")
        .replace(/>/g, "\u0026gt;")
        .replace(/"/g, "\u0026quot;")
        .replace(/'/g, "\u0026#39;");
    };

    const escapedCodeText = escapeHtml(codeText);
    const escapedDisplayText = escapeHtml(displayLines);
    
    // 生成行号
    const displayLinesArray = escapedDisplayText.split('\n');
    const numberedLines = displayLinesArray.map((line, index) =>
      `<span class="line-number">${index + 1}</span><span class="line-content">${line}</span>`
    ).join('\n');
    
    // 如果需要折叠，添加展开按钮
    const expandButton = shouldCollapse ?
      `<button class="expand-button" onclick="expandCodeBlock('${codeId}')">展开全部 ↓</button>` : '';

    if (typeof window !== "undefined") {
      (window as any).codeStorage = (window as any).codeStorage || {};
      (window as any).codeStorage[codeId] = {
        fullCode: escapedCodeText,
        lang: lang
      }; // 存储原始代码用于复制和展开
    }

    return `
      <div class="code-block-wrapper">
        <div class="code-header">
          <span class="language-label" data-lang="${lang}">${lang}</span>
          <button class="copy-button" onclick="copyCodeBlock(this, '${codeId}')" title="复制代码">
            <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <div class="code-content">
          <pre><code class="language-${lang}">${numberedLines}</code></pre>
          ${expandButton}
        </div>
      </div>
    `;
  };

  // 自定义链接处理 img: 前缀
  renderer.link = function ({ href, text }: { href: string; text: string }) {
    if (href && href.startsWith("img:")) {
      const imageUrl = href.substring(4);
      return `
        <div class="markdown-image-container">
          <img src="${imageUrl}" alt="${text || "Image"}" class="markdown-image" />
          ${text ? `<p class="markdown-image-caption">${text}</p>` : ""}
        </div>
      `;
    }
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  marked.use({ renderer });
  return marked(article.value.content);
});

// 上一篇文章
const prevArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = mdFiles.value.findIndex((f) => f.id === article.value.id);
  return currentIndex > 0 ? mdFiles.value[currentIndex - 1] : null;
});

// 下一篇文章
const nextArticle = computed(() => {
  if (!article.value) return null;
  const currentIndex = mdFiles.value.findIndex((f) => f.id === article.value.id);
  return currentIndex < mdFiles.value.length - 1 ? mdFiles.value[currentIndex + 1] : null;
});

// 格式化日期
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

// 跳转文章并回顶部
function goToArticle(id: string) {
  router.push(`/article/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 切换主题
function changeTheme(theme: string) {
  currentTheme.value = theme;
}

// 图片放大功能
function openImageModal(src: string) {
  selectedImage.value = src;
  showImageModal.value = true;
  document.body.style.overflow = 'hidden'; // 阻止背景滚动
}

function closeImageModal() {
  showImageModal.value = false;
  selectedImage.value = '';
  document.body.style.overflow = ''; // 恢复背景滚动
}

// 处理图片错误
function handleImageError(event: Event) {
  console.error("封面图片加载失败:", (event.target as HTMLImageElement).src);
}

// 加载文章
async function loadArticle() {
  const articleTitle = route.params.title as string;
  let foundArticle = getMdFileByTitle(articleTitle);
  
  if (foundArticle) {
    article.value = foundArticle;
    return;
  }
  
  if (mdFiles.value.length === 0) {
    await loadAllMdFiles();
    foundArticle = getMdFileByTitle(articleTitle);
    if (foundArticle) {
      article.value = foundArticle;
      return;
    }
  }
  
  try {
    // 如果通过标题找不到文章，尝试通过ID查找（兼容旧链接）
    let direct: any;
    const articleId = route.params.title as string;
    foundArticle = getMdFileById(articleId);
    
    if (foundArticle) {
      article.value = foundArticle;
      return;
    }
    
    // 如果还是找不到，尝试直接加载文件
    direct = await loadMdFile(`/md/${articleId}.md`);
    mdFiles.value = [...mdFiles.value.filter((f) => f.id !== direct.id), direct];
    article.value = direct;
    return;
  } catch {
    router.push("/articles");
  }
}

// 添加全局复制函数
const addCopyFunction = () => {
  if (typeof window !== "undefined") {
    (window as any).copyCodeBlock = function (button: HTMLElement, codeId: string) {
      if (button.classList.contains("copying")) return;
      button.classList.add("copying");

      const copyIcon = button.querySelector(".copy-icon");
      let checkIcon = button.querySelector(".check-icon");
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

      const codeToCopy = (window as any).codeStorage?.[codeId] || "";

      const copyToClipboard = async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeToCopy);
            return true;
          } else {
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
        } catch {
          return false;
        }
      };

      copyToClipboard().then((success) => {
        if (success) {
          button.classList.add("copied");
          if (copyIcon) (copyIcon as HTMLElement).style.display = "none";
          if (checkIcon) (checkIcon as HTMLElement).style.display = "block";
          setTimeout(() => {
            button.classList.remove("copied", "copying");
            if (copyIcon) (copyIcon as HTMLElement).style.display = "block";
            if (checkIcon) (checkIcon as HTMLElement).style.display = "none";
          }, 2000);
        } else {
          button.classList.remove("copying");
          button.style.backgroundColor = "#ef4444";
          setTimeout(() => {
            button.style.backgroundColor = "";
          }, 1000);
        }
      });
    };
  }
};

// 添加全局图片放大函数
const addImageModalFunction = () => {
  if (typeof window !== "undefined") {
    (window as any).openImageModal = function (src: string) {
      // 创建或获取模态框元素
      let modal = document.getElementById('image-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = `
          <div class="modal-content">
            <img src="" alt="放大图片" />
            <button class="close-btn">×</button>
          </div>
        `;
        document.body.appendChild(modal);
        
        // 添加关闭事件
        modal.addEventListener('click', function(e) {
          if (e.target === modal && modal) {
            (modal as HTMLElement).style.display = 'none';
            document.body.style.overflow = '';
          }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && modal && (modal as HTMLElement).style.display === 'block') {
            (modal as HTMLElement).style.display = 'none';
            document.body.style.overflow = '';
          }
        });
      }
      
      // 设置图片源并显示
      const img = modal.querySelector('img');
      if (img) {
        img.src = src;
      }
      (modal as HTMLElement).style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // 关闭按钮事件
      const closeBtn = modal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          (modal as HTMLElement).style.display = 'none';
          document.body.style.overflow = '';
        });
      }
    };
  }
};

// 添加全局代码展开函数
const addExpandFunction = () => {
  if (typeof window !== "undefined") {
    (window as any).expandCodeBlock = function (codeId: string) {
      const codeStorage = (window as any).codeStorage || {};
      const codeData = codeStorage[codeId];
      
      if (!codeData) return;
      
      // 查找对应的代码块
      const codeBlock = document.querySelector(`.code-block-wrapper`)?.closest('.code-block-wrapper') ||
                        document.querySelector(`.code-block-wrapper`);
      
      if (codeBlock) {
        // 获取pre元素
        const preElement = (codeBlock as Element).querySelector('pre');
        if (preElement) {
          // 生成带行号的完整代码
          const lines = codeData.fullCode.split('\n');
          const numberedLines = lines.map((line: string, index: number) =>
            `<span class="line-number">${index + 1}</span><span class="line-content">${line}</span>`
          ).join('\n');
          
          // 更新代码内容
          preElement.innerHTML = `<code class="language-${codeData.lang}">${numberedLines}</code>`;
          
          // 移除展开按钮
          const expandButton = (codeBlock as Element).querySelector('.expand-button');
          if (expandButton) {
            expandButton.remove();
          }
        }
      }
    };
  }
};

// AI 猫娘摘要
const reply = ref(""); // 最终显示的内容
const fullReply = ref(""); // AI 返回的完整内容
const typingSpeed = 50; // 每个字延迟，单位毫秒

const sendMessage = async () => {
  if (!article.value?.content?.trim()) {
    reply.value = "喵呜~文章还没加载好呢~";
    return;
  }

  reply.value = "猫娘思考中喵~";

  try {
    const contentToSend = article.value.content;
    const res = await fetch("https://api.chatanywhere.tech/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-Pg4qRM4ZsFpgrpfv6sw2riJRNc55rPQ5er23xlGjcUsIsfPP",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一只可爱的总结文章猫娘，你现在看到的就是所有话都是文章帮助人总结，说话最多50字，语气可爱，带点喵~" },
          { role: "user", content: contentToSend },
        ],
        max_tokens: 200000,
      }),
    });

    const result = await res.json();
    fullReply.value = result.choices?.[0]?.message?.content?.trim() || "喵呜~没有生成结果呢~";

    // 清空显示
    reply.value = "";
    let index = 0;

    // 打字机效果函数
    const typeWriter = () => {
      if (index < fullReply.value.length) {
        reply.value += fullReply.value[index];
        index++;
        setTimeout(typeWriter, typingSpeed);
      }
    };

    typeWriter(); // 启动
  } catch {
    reply.value = "喵~出错了，请稍后再试~";
  }
};

// 初始化
onMounted(() => {
  loadArticle();
  addCopyFunction();
  addImageModalFunction();
  addExpandFunction();

});

// 路由变化重新加载文章
watch(() => route.params.title, () => {
  loadArticle();
});
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
/* AI 摘要容器 */
.ai {
  width: 100%;
  min-height: 120px; /* 高度稍微增加，显示多行 */
  padding: 20px 20px 20px 30px; /* 左边留空间，右下按钮浮动 */
  margin-top: 20px;
  background-color: #fffbea; /* 柔和背景色 */
  border-radius: 40px; /* 圆角更圆 */
  border: 3px solid #ffe066; /* 黄色边框 */
  box-shadow: 0 4px 15px rgba(255, 198, 88, 0.3); /* 柔光阴影 */
  position: relative;
  font-family: "Comic Sans MS", "Microsoft YaHei", sans-serif; /* 萌系字体 */
  font-size: 16px;
  color: #333;
  overflow-wrap: break-word; /* 自动换行 */
}

/* 显示文本的区域 */
.ai1 {
  width: calc(100% - 80px); /* 留出按钮位置 */
  min-height: 60px;
  line-height: 1.6; /* 行高更舒适 */
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap; /* 保留换行 */
}

/* 摘要按钮 */
.ai3 {
  position: absolute;
  right: 15px;
  bottom: 15px;
  width: 70px;
  height: 40px;
  background-color: #ffe066; /* 明亮黄色 */
  border: none;
  border-radius: 20px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(255, 198, 88, 0.4);
}

.ai3:hover {
  background-color: #ffd633;
  transform: translateY(-2px);
}

/* 图片放大模态框样式 */
.image-modal {
  display: none;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}

.modal-content {
  position: relative;
  margin: auto;
  padding: 20px;
  width: 90%;
  max-width: 900px;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 25px;
  color: #fff;
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
}

.close-btn:hover {
  color: #ccc;
}

/* 代码块行号样式 */
.code-block-wrapper {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d3748;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.language-label {
  font-weight: 600;
  text-transform: uppercase;
}

.copy-button {
  background: none;
  border: none;
  color: #e2e8f0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.copy-button.copied {
  color: #48bb78;
}

.code-content {
  position: relative;
}

.code-content pre {
  margin: 0;
  padding: 1rem;
  overflow: auto;
  max-height: 500px;
}

.code-content code {
  display: block;
  line-height: 1.5;
}

.code-content .line-number {
  display: inline-block;
  width: 30px;
  padding-right: 10px;
  text-align: right;
  color: #a0aec0;
  border-right: 1px solid #4a5568;
  margin-right: 10px;
}

.expand-button {
  display: block;
  width: 100%;
  padding: 0.5rem;
  background-color: #4a5568;
  color: #e2e8f0;
  border: none;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
}

.expand-button:hover {
  background-color: #2d3748;
}

/* 点击放大图片样式 */
.clickable-image {
  cursor: pointer;
  transition: transform 0.2s;
}

.clickable-image:hover {
  transform: scale(1.05);
}

</style>

