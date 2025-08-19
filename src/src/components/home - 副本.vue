<template>
<div class="simple-article-list">
  <div class="loading" v-if="loading">
    加载中...
  </div>

  <div class="error" v-else-if="error">
    错误: {{ error }}
  </div>

  <div class="articles" v-else>
    <div v-if="mdFiles.length === 0" class="no-articles">
      没有找到文章
    </div>

    <div v-else class="article-grid">
      <div v-for="article in paginatedArticles" :key="article.id" class="article-card" @click="viewArticle(article.id)">
        <!-- 文章封面 -->
        <div class="article-cover">
          <img v-if="article.cover" :src="article.cover" :alt="article.title" class="cover-image" />
          <img v-else src="/sword.png" :alt="article.title" class="cover-image" />
        </div>
        <div class="article-info">
          <h3>{{ article.title }} <div class="xiaobiao"> &nbsp;></div>
          </h3>
          <p class="description">{{ article.description }}</p>
          <div class="meta">
            <span class="fontcolor"><svg
               width="1em" class="svg" viewBox="-43 -17 536 536.00104" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m385.4375 36.597656h-51.835938v-24.105468c0-6.902344-5.589843-12.492188-12.492187-12.492188-6.894531 0-12.488281 5.589844-12.488281 12.492188v23.980468h-171.125v-23.980468c0-6.902344-5.589844-12.492188-12.488282-12.492188-6.894531 0-12.492187 5.589844-12.492187 12.492188v23.980468h-51.835937c-34.484376.015625-62.4375 27.964844-62.453126 62.453125v341.121094c.015626 34.488281 27.96875 62.441406 62.453126 62.453125h324.757812c34.492188-.011719 62.445312-27.964844 62.453125-62.453125v-340.996094c-.007813-34.484375-27.960937-62.441406-62.453125-62.453125zm-324.757812 24.980469h51.835937v23.984375c0 6.898438 5.597656 12.488281 12.492187 12.488281 6.898438 0 12.488282-5.589843 12.488282-12.488281v-23.984375h171.003906v23.984375c0 6.898438 5.589844 12.488281 12.488281 12.488281 6.898438 0 12.492188-5.589843 12.492188-12.488281v-23.984375h51.957031c20.671875.058594 37.414062 16.800781 37.472656 37.472656v30.726563h-399.703125v-30.726563c.019531-20.6875 16.785157-37.457031 37.472657-37.472656zm324.757812 416.0625h-324.757812c-20.667969-.058594-37.40625-16.796875-37.472657-37.472656v-285.410157h399.703125v285.410157c-.058594 20.675781-16.800781 37.414062-37.472656 37.472656zm0 0"
                  fill="#000000" style="fill: rgb(207, 108, 127);"></path>
                <path
                  d="m345.59375 262.800781h-245.066406c-6.898438 0-12.488282 5.597657-12.488282 12.492188 0 6.898437 5.589844 12.492187 12.488282 12.492187h245.066406c6.898438 0 12.492188-5.59375 12.492188-12.492187 0-6.894531-5.59375-12.492188-12.492188-12.492188zm0 0"
                  fill="#000000" style="fill: rgb(207, 108, 127);"></path>
                <path
                  d="m242.296875 344.492188h-141.769531c-6.898438 0-12.488282 5.59375-12.488282 12.492187s5.589844 12.492187 12.488282 12.492187h141.769531c6.898437 0 12.492187-5.59375 12.492187-12.492187s-5.59375-12.492187-12.492187-12.492187zm0 0"
                  fill="#000000" style="fill: rgb(207, 108, 127);"></path>
              </svg><span class="date"> {{ formatDate(article.date) }}</span></span>
            <div class="tags">
              <span v-for="tag in article.tags" :key="tag" class="tag" @click.stop="filterByTag(tag)">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="totalPages > 1">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>

      <button v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }"
        @click="changePage(page)">
        {{ page }}
      </button>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
    </div>

  </div>

</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 导入 Markdown 文件加载器
import { mdFiles, loadAllMdFiles } from '../utils/mdLoader'
const route = useRoute()
const router = useRouter()

// 从 URL 查询参数获取初始页码，如果不存在则默认为 1
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = 6

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(mdFiles.value.length / itemsPerPage)
})

// 当前页显示的文章
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return mdFiles.value.slice(start, start + itemsPerPage)
})

// 切换页码
function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 更新 URL 查询参数
    router.replace({ query: { ...route.query, page } })
    // 滚动到顶部
    scrollToTop();
  }
}
// 滚动到顶部
function scrollToTop() {
  // 使用微任务延迟确保DOM更新完成后再滚动
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const loading = ref(false)
const error = ref('')
// 加载文章数据
async function loadArticles() {
  loading.value = true
  error.value = ''

  try {
    await loadAllMdFiles()
    // 按时间排序文章（最新的在前）
    mdFiles.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载文章失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载文章
onMounted(() => {
  loadArticles()
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 监听路由变化，当查询参数中的 page 变化时更新 currentPage 并滚动到顶部
watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1
  if (page !== currentPage.value) {
    currentPage.value = page
    // 滚动到顶部
    scrollToTop()
  }
})

function viewArticle(id: string) {
  router.push(`/article/${id}`)
  // 自动回到顶部
  scrollToTop()
}

// 按标签筛选文章
function filterByTag(tag: string) {
  console.log('按标签筛选:', tag)
  // 跳转到文章列表页面并传递标签参数
  router.push(`/article-list?tag=${encodeURIComponent(tag)}`)
}
</script>

<style scoped>
.simple-article-list {
  flex: 1;
  padding: 2rem;
}

.loading,
.error,
.no-articles {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #dc2626;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .article-grid {
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  }
}

.article-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.405) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.1);
  overflow: hidden;
}

.article-cover {
  right: 0;
  width: 20%;
  height: 200px;
  overflow: hidden;
  position: absolute;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .cover-image {
  transform: scale(1.05);
}

.article-info {
  position: relative;
  padding: 2rem;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 114, 150, 0.1);
  border-color: #3b82f6;
}

.article-card h3 {
  position: relative;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #111827;
}

.article-card h3:hover {
  color: #5ca2e9;
  transition: all 0.3s ease;
}

.article-card h3::after {
  position: absolute;
  content: "";
  top: 10px;
  left: -2.5%;
  background-color: rgba(255, 114, 149, 0.678);
  width: 5px;
  height: 20px;
  border-radius: 10px;
  transition: background-color 0.3s ease, top 0.3s ease;
}

.article-card h3::before {
  position: absolute;
  content: "";
  top: 35px;
  left: -2.5%;
  background-color: transparent;
  width: 5px;
  height: 20px;
  border-radius: 10px;
  transition: background-color 0.3s ease, top 0.3s ease;
}

h3:hover::after {
  background-color: rgba(255, 114, 149, 0);
  top: -25px;
}

h3:hover::before {
  background-color: rgba(255, 114, 149, 0.675);
  top: 10px;
}

.description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.xiaobiao {
  position: absolute;
  display: inline;
  color: rgba(255, 114, 149, 0.678);
  color: transparent;
  transition: all 0.3s ease-in-out;
  font-size: 40px;
  top: -14px;
  transform: translateX(-20px);
}

h3:hover .xiaobiao {
  color: rgba(255, 114, 149, 0.678);
  transition: all 0.3s ease-in-out;
  transform: translateX(0px);
}

.svg {
  display: inline-block;
  transform: translateY(-2px);
  color: rgba(255, 114, 149, 0.678);
}

.meta {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 0.875rem;
  color: rgb(207, 108, 127);
  margin-left: 20px;
  margin-right: 30px;
}

.tags {
  display: flex;
  gap: 0.5rem;
  color: rgb(207, 108, 127);
  ;
}

.tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #1a202c;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(168, 237, 234, 0.3);
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.debug-info h3 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.debug-info p {
  margin: 0.5rem 0;
  color: #6b7280;
}

button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background: #2563eb;
}

/* 分页组件样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ffb6c1, #ff69b4);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(255, 105, 180, 0.3);
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 105, 180, 0.4);
}

.pagination button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination button.active {
  background: linear-gradient(135deg, #ff1493, #c71585);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(255, 20, 147, 0.5);
}
</style>
