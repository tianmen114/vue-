<template>
  <div class="archive-page">
    <div class="container">
      <h1>文章归档</h1>
      <p class="subtitle">共 {{ totalCount }} 篇文章</p>

      <div v-if="groupsSorted.length === 0" class="empty">暂无文章</div>

      <div v-else class="timeline">
        <!-- 绳子 -->
        <div class="rope"></div>
        
        <!-- 时间轴项 -->
        <div v-for="group in groupsSorted" :key="group.key" class="timeline-item">
          <!-- 年份大锚点 -->
          <div class="year-anchor">
            <div class="anchor-dot large"></div>
            <div class="anchor-label">{{ group.year }}年</div>
          </div>
          
          <!-- 月份小锚点和文章 -->
          <div class="month-section">
            <div v-for="monthGroup in group.months" :key="monthGroup.key" class="month-item">
              <!-- 月份小锚点 -->
              <div class="month-anchor">
                <div class="anchor-dot small"></div>
                <div class="anchor-label">{{ monthGroup.month }}月</div>
              </div>
              
              <!-- 该月的文章列表 -->
              <div class="posts">
                <div 
                  v-for="post in monthGroup.items" 
                  :key="post.id" 
                  class="post-item"
                >
                  <div class="post-dot"></div>
                  <div class="post-content">
                    <RouterLink :to="`/article/${post.id}`" class="post-title">
                      {{ post.title }}
                    </RouterLink>
                    <div class="post-meta">
                      <span class="post-date">{{ formatPostDate(post.date) }}</span>
                      <span v-if="post.tags?.length" class="post-tags">
                        <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { mdFiles, loadAllMdFiles, type MdFile } from '@/utils/mdLoader'

onMounted(async () => {
  if (mdFiles.value.length === 0) {
    await loadAllMdFiles()
  }
})

const totalCount = computed(() => mdFiles.value.length)

// 按年份和月份分组
const groupsSorted = computed(() => {
  // 按年份分组
  const yearMap = new Map<string, { 
    year: string, 
    months: Map<string, MdFile[]> 
  }>()
  
  // 遍历所有文章
  for (const file of mdFiles.value) {
    const date = new Date(file.date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    
    // 如果没有该年份，创建新的年份对象
    if (!yearMap.has(year)) {
      yearMap.set(year, { 
        year, 
        months: new Map<string, MdFile[]>() 
      })
    }
    
    // 获取该年份对象
    const yearObj = yearMap.get(year)!
    
    // 如果没有该月份，创建新的月份数组
    const monthKey = `${year}-${month}`
    if (!yearObj.months.has(monthKey)) {
      yearObj.months.set(monthKey, [])
    }
    
    // 将文章添加到对应月份
    yearObj.months.get(monthKey)!.push(file)
  }
  
  // 转换为数组并排序
  const result = Array.from(yearMap.entries()).map(([year, yearData]) => {
    // 按月份分组并排序
    const months = Array.from(yearData.months.entries()).map(([monthKey, items]) => {
      // 同月内按日期倒序排列
      items.sort((a, b) => +new Date(b.date) - +new Date(a.date))
      
      // 提取月份
      const month = monthKey.split('-')[1]
      
      return {
        key: monthKey,
        month,
        items
      }
    })
    
    // 按月份倒序排列
    months.sort((a, b) => (a.month < b.month ? 1 : -1))
    
    return {
      key: year,
      year,
      months
    }
  })
  
  // 按年份倒序排列
  result.sort((a, b) => (a.year < b.year ? 1 : -1))
  
  return result
})

// 格式化文章日期（只显示月日时分）
function formatPostDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
</script>

<style scoped>
.archive-page {
  padding: 1rem;
  min-width: 900px;
  margin: 14px 50px;
}

.container {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  position: relative;
}

h1 {
  margin: 0 0 0.5rem;
  color: #111827;
}

.subtitle {
  margin: 0 0 2rem;
  color: #6b7280;
}

.empty {
  color: #6b7280;
  text-align: center;
  padding: 2rem;
}

/* 时间轴容器 */
.timeline {
  position: relative;
  padding-left: 120px;
  padding-top: 20px;
  padding-bottom: 20px;
}

/* 绳子 */
.rope {
  position: absolute;
  left: 120px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

/* 时间轴项 */
.timeline-item {
  position: relative;
}

/* 年份大锚点 */
.year-anchor {
  position: absolute;
  left: -130px;
  top: -2px;
  display: flex;
  align-items: center;
  width: 120px;
}
.year-anchor.large:hover{
  box-shadow: 0px 0px 4px 4px #8b5cf6;
}
.anchor-dot {
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  position: relative;
  z-index: 2;
}

.anchor-dot.large {
  width: 24px;
  height: 24px;
  background-color: rgba(255, 167, 167, 0.749);
}

.anchor-dot.small {
  width: 16px;
  height: 16px;
}

.anchor-label {
  margin-left: 10px;
  font-weight: bold;
  color: #374151;
  white-space: nowrap;
}

/* 月份部分 */
.month-section {
  margin-top: 0rem;
}

/* 月份项 */
.month-item {
  position: relative;
  margin-bottom: 1.5rem;
}

/* 月份小锚点 */
.month-anchor {
  position: absolute;
  left: -100px;
  top: 1rem;
  display: flex;
  align-items: center;
  width: 100px;
}

/* 文章列表 */
.posts {
  margin-top: 0.5rem;
  margin-left: 20px;
  border-left: 2px dashed rgba(59, 130, 246, 0.3);
  padding-left: 20px;
}

/* 文章项 */
.post-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  position: relative;
}

.post-item:first-child {
  padding-top: 0;
}

.post-item:last-child {
  padding-bottom: 0;
}

/* 文章点 */
.post-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8b5cf6;
  position: absolute;
  left: -26px;
  top: 1.8rem;
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
  z-index: 1;
}

/* 文章内容 */
.post-content {
  flex: 1;
}

.post-title {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.post-title:hover {
  text-decoration: underline;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.post-date {
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .archive-page {
    min-width: auto;
    margin: 14px;
  }
  
  .container {
    padding: 1.5rem;
  }
  
  .timeline {
    padding-left: 100px;
  }
  
  .rope {
    left: 100px;
  }
  
  .year-anchor {
    left: -100px;
    width: 100px;
  }
  
  .month-anchor {
    left: -80px;
    width: 80px;
  }
  
  .posts {
    margin-left: 15px;
    padding-left: 15px;
  }
  
  .post-dot {
    left: -21px;
    top: 1.8rem;
  }
  
  .year-anchor, .month-anchor {
    top: 1.2rem;
  }
}
.anchor-dot.large::after,
.anchor-dot.small::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  filter: blur(5px);
  opacity: 0.5;
  z-index: -1;
  transition: transform 0.3s ease-in-out;
}

.anchor-dot.large:hover::after,
.anchor-dot.small:hover::after {
  transform: scale(1.5);
}
.post-title {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #2563eb;
}


</style>
