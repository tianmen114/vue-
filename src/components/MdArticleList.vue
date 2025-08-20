<template>
  <div class="md-article-list">
    <div class="list-header">
      <h2>文章列表</h2>
      <div class="search-box">
        <Input 
          v-model="searchQuery" 
          placeholder="搜索文章..." 
          class="search-input"
        />
      </div>
    </div>
    
    <div class="filter-tags" v-if="allTags.length > 0">
      <span class="filter-label">标签筛选:</span>
      <div class="tag-buttons">
        <Button 
          :variant="selectedTag === '' ? 'default' : 'outline'"
          size="sm"
          @click="selectedTag = ''"
        >
          全部
        </Button>
                 <Button 
           v-for="tag in allTags" 
           :key="tag"
           :variant="selectedTag === tag ? 'default' : 'outline'"
           size="sm"
           @click="selectTag(tag)"
         >
           {{ tag }}
         </Button>
      </div>
    </div>
    
    <div class="articles-grid">
             <Card 
         v-for="article in filteredArticles" 
         :key="article.id"
         class="article-card"
         @click="viewArticle(article)"
       >
         <!-- 文章封面 -->
         <div class="article-cover">
           <img 
             v-if="article.cover" 
             :src="article.cover" 
             :alt="article.title"
             class="cover-image"
           />
           <img 
             v-else
             src="/sword.png" 
             :alt="article.title"
             class="cover-image"
           />
         </div>
         <CardHeader>
           <CardTitle>
             {{ article.title }}
             <span v-if="article.top !== undefined" class="top-tag">置顶</span>
           </CardTitle>
           <CardDescription>{{ article.description }}</CardDescription>
         </CardHeader>
         <CardContent>
           <div class="article-meta">
             <span class="date">{{ formatDate(article.date) }}</span>
             <div class="tags">
               <span 
                 v-for="tag in article.tags" 
                 :key="tag"
                 class="tag"
                 @click.stop="selectTag(tag)"
               >
                 {{ tag }}
               </span>
             </div>
           </div>
         </CardContent>
       </Card>
    </div>
    
    <div v-if="filteredArticles.length === 0" class="no-articles">
      <p>没有找到相关文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mdFiles, loadAllMdFiles, searchMdFiles, getMdFilesByTag, generateFileIdFromTitle } from '@/utils/mdLoader'

const router = useRouter()
const searchQuery = ref('')
const selectedTag = ref('')

// 计算所有标签
const allTags = computed(() => {
  const tags = new Set<string>()
  mdFiles.value.forEach(file => {
    file.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// 过滤文章
const filteredArticles = computed(() => {
  let articles = mdFiles.value
  
  // 按标签过滤
  if (selectedTag.value) {
    articles = getMdFilesByTag(selectedTag.value)
  }
  
  // 按搜索词过滤
  if (searchQuery.value) {
    articles = searchMdFiles(searchQuery.value)
  }
  
  return articles.sort((a, b) => {
    // 首先按 top 值降序排序（数值大的在前）
    if (a.top !== undefined && b.top !== undefined) {
      if (a.top !== b.top) {
        return b.top - a.top
      }
    } else if (a.top !== undefined) {
      return -1  // a 有 top 值，排在前面
    } else if (b.top !== undefined) {
      return 1   // b 有 top 值，排在前面
    }
    
    // top 值相同的或都没有 top 值的，按日期降序排序
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 查看文章
function viewArticle(article: { id: string; title: string }) {
  // 只使用ID作为路由参数，不依赖标题
  router.push(`/article/${article.id}`);
  // 自动回到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 选择标签
function selectTag(tag: string) {
  console.log('选择标签:', tag)
  selectedTag.value = tag
}

// 加载文章
onMounted(async () => {
  await loadAllMdFiles()
  // 按时间排序文章（最新的在前）
  // mdFiles.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
</script>

<style scoped>
.md-article-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
}

.search-box {
  width: 300px;
}

.search-input {
  width: 100%;
}

.filter-tags {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-weight: 500;
  color: #666;
}

.tag-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.1);
  overflow: hidden;
}

.article-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
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

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.date {
  font-size: 0.875rem;
  color: #666;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(168, 237, 234, 0.3);
}

.top-tag {
  display: inline-block;
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.no-articles {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tags {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tag-buttons {
    justify-content: center;
  }
}
</style>
