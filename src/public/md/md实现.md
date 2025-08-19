---
title: 学习md功能实现
date: 2025-08-17T00:22:00
tags: [Vue, md, 教程]
description: 带你了解md
mdimg:https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMqaKCxee51bmP5FIpWheZpE6-w25cAAu3FMRsp-ghVrwbEu7ErZeYBAAMCAAN5AAM2BA.png
---
# Vue3文章归档功能实现详细指南

本文档将详细介绍如何在Vue3项目中实现一个带有动画效果的文章归档页面，包括时间轴设计、数据处理和交互动画。

## 目录
1. [项目结构](#项目结构)
2. [安装依赖](#安装依赖)
3. [数据结构设计](#数据结构设计)
4. [数据加载](#数据加载)
5. [时间轴组件实现](#时间轴组件实现)
6. [动画效果实现](#动画效果实现)
7. [响应式设计](#响应式设计)
8. [完整代码](#完整代码)

## 项目结构

```
src/
├── components/
│   └── Archive.vue     # 归档页面组件
├── utils/
│   ├── mdLoader.ts     # Markdown文件加载工具
│   └── mdScanner.ts    # Markdown文件扫描工具
└── public/
    └── md/             # Markdown文章目录
```

## 安装依赖

首先，我们需要安装用于动画效果的framer-motion库：

```bash
npm install framer-motion
```

## 数据结构设计

我们的文章数据结构需要包含以下字段：

```typescript
interface MdFile {
  id: string;        // 文章ID（文件名）
  title: string;     // 文章标题
  date: string;      // 发布日期
  content: string;   // 文章内容
  tags?: string[];   // 标签数组
  cover?: string;    // 封面图片路径
  pinned?: boolean;  // 是否置顶
}
```

## 数据加载

创建`src/utils/mdLoader.ts`文件来处理Markdown文件的加载：

```typescript
import { ref } from 'vue'
import { scanMdFiles } from './mdScanner'

// 存储所有Markdown文件的响应式引用
export const mdFiles = ref<MdFile[]>([])

// 加载所有Markdown文件
export async function loadAllMdFiles() {
  try {
    // 扫描public/md目录下的所有Markdown文件
    const files = await scanMdFiles()
    
    // 按日期倒序排列
    mdFiles.value = files.sort((a, b) => 
      +new Date(b.date) - +new Date(a.date)
    )
  } catch (error) {
    console.error('加载Markdown文件失败:', error)
  }
}
```

创建`src/utils/mdScanner.ts`文件来扫描Markdown文件：

```typescript
// 扫描public/md目录下的所有Markdown文件
export async function scanMdFiles(): Promise<MdFile[]> {
  // 使用Vite的import.meta.glob导入所有Markdown文件
  const modules = import.meta.glob('../../public/md/*.md', { 
    as: 'raw', 
    eager: true 
  })
  
  const files: MdFile[] = []
  
  // 遍历所有导入的文件
  for (const path in modules) {
    const content = modules[path]
    
    // 从文件路径提取文件名作为ID
    const fileName = path.split('/').pop()?.replace('.md', '') || ''
    
    // 解析文件内容，提取标题和元数据
    const { title, date, tags, cover, pinned } = parseFrontmatter(content)
    
    files.push({
      id: fileName,
      title: title || fileName,
      date: date || new Date().toISOString(),
      content,
      tags,
      cover,
      pinned
    })
  }
  
  return files
}

// 解析Markdown文件的前置元数据
function parseFrontmatter(content: string): any {
  // 简化的解析逻辑，实际项目中可能需要更复杂的解析
  const lines = content.split('\n')
  let title = ''
  let date = ''
  let tags: string[] = []
  let cover = ''
  let pinned = false
  
  // 查找标题（以#开头的行）
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.substring(2).trim()
      break
    }
  }
  
  return { title, date, tags, cover, pinned }
}
```

## 时间轴组件实现

创建`src/components/Archive.vue`文件：

```vue
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
            <motion.div 
              class="anchor-dot large"
              :whileHover="{ scale: 1.2 }"
              :whileTap="{ scale: 0.9 }"
              :transition="{ type: 'spring', stiffness: 500 }"
            ></motion.div>
            <div class="anchor-label">{{ group.year }}年</div>
          </div>
          
          <!-- 月份小锚点和文章 -->
          <div class="month-section">
            <div v-for="monthGroup in group.months" :key="monthGroup.key" class="month-item">
              <!-- 月份小锚点 -->
              <div class="month-anchor">
                <motion.div 
                  class="anchor-dot small"
                  :whileHover="{ scale: 1.3 }"
                  :whileTap="{ scale: 0.8 }"
                  :transition="{ type: 'spring', stiffness: 500 }"
                ></motion.div>
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
import { motion } from 'framer-motion'

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
</style>
```

## 动画效果实现

我们使用framer-motion库为时间轴上的锚点添加交互动画效果：

1. **导入motion组件**：
   ```typescript
   import { motion } from 'framer-motion'
   ```

2. **为年份大锚点添加动画**：
   ```vue
   <motion.div 
     class="anchor-dot large"
     :whileHover="{ scale: 1.2 }"
     :whileTap="{ scale: 0.9 }"
     :transition="{ type: 'spring', stiffness: 500 }"
   ></motion.div>
   ```

3. **为月份小锚点添加动画**：
   ```vue
   <motion.div 
     class="anchor-dot small"
     :whileHover="{ scale: 1.3 }"
     :whileTap="{ scale: 0.8 }"
     :transition="{ type: 'spring', stiffness: 500 }"
   ></motion.div>
   ```

## 响应式设计

为了确保归档页面在不同设备上都能良好显示，我们实现了响应式设计：

```css
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
```

## 完整代码

以上就是实现Vue3文章归档功能的完整步骤。最终效果包括：
1. 按年份和月份分组的文章时间轴
2. 绳子状的时间轴设计
3. 带有交互动画的锚点
4. 响应式布局适配不同设备

通过以上步骤，你可以创建一个功能完整、视觉美观的文章归档页面。
