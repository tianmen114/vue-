const r=`---\r
title: 学习md功能实现\r
date: 2025-08-17T00:22:00\r
tags: [Vue, md, 教程]\r
description: 带你了解md\r
mdimg:https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMqaKCxee51bmP5FIpWheZpE6-w25cAAu3FMRsp-ghVrwbEu7ErZeYBAAMCAAN5AAM2BA.png\r
top: 3\r
---\r
# Vue3文章归档功能实现详细指南\r
\r
本文档将详细介绍如何在Vue3项目中实现一个带有动画效果的文章归档页面，包括时间轴设计、数据处理和交互动画。\r
\r
## 目录\r
1. [项目结构](#项目结构)\r
2. [安装依赖](#安装依赖)\r
3. [数据结构设计](#数据结构设计)\r
4. [数据加载](#数据加载)\r
5. [时间轴组件实现](#时间轴组件实现)\r
6. [动画效果实现](#动画效果实现)\r
7. [响应式设计](#响应式设计)\r
8. [完整代码](#完整代码)\r
\r
## 项目结构\r
\r
\`\`\`\r
src/\r
├── components/\r
│   └── Archive.vue     # 归档页面组件\r
├── utils/\r
│   ├── mdLoader.ts     # Markdown文件加载工具\r
│   └── mdScanner.ts    # Markdown文件扫描工具\r
└── public/\r
    └── md/             # Markdown文章目录\r
\`\`\`\r
\r
## 安装依赖\r
\r
首先，我们需要安装用于动画效果的framer-motion库：\r
\r
\`\`\`bash\r
npm install framer-motion\r
\`\`\`\r
\r
## 数据结构设计\r
\r
我们的文章数据结构需要包含以下字段：\r
\r
\`\`\`typescript\r
interface MdFile {\r
  id: string;        // 文章ID（文件名）\r
  title: string;     // 文章标题\r
  date: string;      // 发布日期\r
  content: string;   // 文章内容\r
  tags?: string[];   // 标签数组\r
  cover?: string;    // 封面图片路径\r
  pinned?: boolean;  // 是否置顶\r
}\r
\`\`\`\r
\r
## 数据加载\r
\r
创建\`src/utils/mdLoader.ts\`文件来处理Markdown文件的加载：\r
\r
\`\`\`typescript\r
import { ref } from 'vue'\r
import { scanMdFiles } from './mdScanner'\r
\r
// 存储所有Markdown文件的响应式引用\r
export const mdFiles = ref<MdFile[]>([])\r
\r
// 加载所有Markdown文件\r
export async function loadAllMdFiles() {\r
  try {\r
    // 扫描public/md目录下的所有Markdown文件\r
    const files = await scanMdFiles()\r
    \r
    // 按日期倒序排列\r
    mdFiles.value = files.sort((a, b) => \r
      +new Date(b.date) - +new Date(a.date)\r
    )\r
  } catch (error) {\r
    console.error('加载Markdown文件失败:', error)\r
  }\r
}\r
\`\`\`\r
\r
创建\`src/utils/mdScanner.ts\`文件来扫描Markdown文件：\r
\r
\`\`\`typescript\r
// 扫描public/md目录下的所有Markdown文件\r
export async function scanMdFiles(): Promise<MdFile[]> {\r
  // 使用Vite的import.meta.glob导入所有Markdown文件\r
  const modules = import.meta.glob('../../public/md/*.md', { \r
    as: 'raw', \r
    eager: true \r
  })\r
  \r
  const files: MdFile[] = []\r
  \r
  // 遍历所有导入的文件\r
  for (const path in modules) {\r
    const content = modules[path]\r
    \r
    // 从文件路径提取文件名作为ID\r
    const fileName = path.split('/').pop()?.replace('.md', '') || ''\r
    \r
    // 解析文件内容，提取标题和元数据\r
    const { title, date, tags, cover, pinned } = parseFrontmatter(content)\r
    \r
    files.push({\r
      id: fileName,\r
      title: title || fileName,\r
      date: date || new Date().toISOString(),\r
      content,\r
      tags,\r
      cover,\r
      pinned\r
    })\r
  }\r
  \r
  return files\r
}\r
\r
// 解析Markdown文件的前置元数据\r
function parseFrontmatter(content: string): any {\r
  // 简化的解析逻辑，实际项目中可能需要更复杂的解析\r
  const lines = content.split('\\n')\r
  let title = ''\r
  let date = ''\r
  let tags: string[] = []\r
  let cover = ''\r
  let pinned = false\r
  \r
  // 查找标题（以#开头的行）\r
  for (const line of lines) {\r
    if (line.startsWith('# ')) {\r
      title = line.substring(2).trim()\r
      break\r
    }\r
  }\r
  \r
  return { title, date, tags, cover, pinned }\r
}\r
\`\`\`\r
\r
## 时间轴组件实现\r
\r
创建\`src/components/Archive.vue\`文件：\r
\r
\`\`\`vue\r
<template>\r
  <div class="archive-page">\r
    <div class="container">\r
      <h1>文章归档</h1>\r
      <p class="subtitle">共 {{ totalCount }} 篇文章</p>\r
\r
      <div v-if="groupsSorted.length === 0" class="empty">暂无文章</div>\r
\r
      <div v-else class="timeline">\r
        <!-- 绳子 -->\r
        <div class="rope"></div>\r
        \r
        <!-- 时间轴项 -->\r
        <div v-for="group in groupsSorted" :key="group.key" class="timeline-item">\r
          <!-- 年份大锚点 -->\r
          <div class="year-anchor">\r
            <motion.div \r
              class="anchor-dot large"\r
              :whileHover="{ scale: 1.2 }"\r
              :whileTap="{ scale: 0.9 }"\r
              :transition="{ type: 'spring', stiffness: 500 }"\r
            ></motion.div>\r
            <div class="anchor-label">{{ group.year }}年</div>\r
          </div>\r
          \r
          <!-- 月份小锚点和文章 -->\r
          <div class="month-section">\r
            <div v-for="monthGroup in group.months" :key="monthGroup.key" class="month-item">\r
              <!-- 月份小锚点 -->\r
              <div class="month-anchor">\r
                <motion.div \r
                  class="anchor-dot small"\r
                  :whileHover="{ scale: 1.3 }"\r
                  :whileTap="{ scale: 0.8 }"\r
                  :transition="{ type: 'spring', stiffness: 500 }"\r
                ></motion.div>\r
                <div class="anchor-label">{{ monthGroup.month }}月</div>\r
              </div>\r
              \r
              <!-- 该月的文章列表 -->\r
              <div class="posts">\r
                <div \r
                  v-for="post in monthGroup.items" \r
                  :key="post.id" \r
                  class="post-item"\r
                >\r
                  <div class="post-dot"></div>\r
                  <div class="post-content">\r
                    <RouterLink :to="\`/article/\${post.id}\`" class="post-title">\r
                      {{ post.title }}\r
                    </RouterLink>\r
                    <div class="post-meta">\r
                      <span class="post-date">{{ formatPostDate(post.date) }}</span>\r
                      <span v-if="post.tags?.length" class="post-tags">\r
                        <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>\r
                      </span>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</template>\r
\r
<script setup lang="ts">\r
import { computed, onMounted } from 'vue'\r
import { mdFiles, loadAllMdFiles, type MdFile } from '@/utils/mdLoader'\r
import { motion } from 'framer-motion'\r
\r
onMounted(async () => {\r
  if (mdFiles.value.length === 0) {\r
    await loadAllMdFiles()\r
  }\r
})\r
\r
const totalCount = computed(() => mdFiles.value.length)\r
\r
// 按年份和月份分组\r
const groupsSorted = computed(() => {\r
  // 按年份分组\r
  const yearMap = new Map<string, { \r
    year: string, \r
    months: Map<string, MdFile[]> \r
  }>()\r
  \r
  // 遍历所有文章\r
  for (const file of mdFiles.value) {\r
    const date = new Date(file.date)\r
    const year = date.getFullYear().toString()\r
    const month = (date.getMonth() + 1).toString().padStart(2, '0')\r
    \r
    // 如果没有该年份，创建新的年份对象\r
    if (!yearMap.has(year)) {\r
      yearMap.set(year, { \r
        year, \r
        months: new Map<string, MdFile[]>() \r
      })\r
    }\r
    \r
    // 获取该年份对象\r
    const yearObj = yearMap.get(year)!\r
    \r
    // 如果没有该月份，创建新的月份数组\r
    const monthKey = \`\${year}-\${month}\`\r
    if (!yearObj.months.has(monthKey)) {\r
      yearObj.months.set(monthKey, [])\r
    }\r
    \r
    // 将文章添加到对应月份\r
    yearObj.months.get(monthKey)!.push(file)\r
  }\r
  \r
  // 转换为数组并排序\r
  const result = Array.from(yearMap.entries()).map(([year, yearData]) => {\r
    // 按月份分组并排序\r
    const months = Array.from(yearData.months.entries()).map(([monthKey, items]) => {\r
      // 同月内按日期倒序排列\r
      items.sort((a, b) => +new Date(b.date) - +new Date(a.date))\r
      \r
      // 提取月份\r
      const month = monthKey.split('-')[1]\r
      \r
      return {\r
        key: monthKey,\r
        month,\r
        items\r
      }\r
    })\r
    \r
    // 按月份倒序排列\r
    months.sort((a, b) => (a.month < b.month ? 1 : -1))\r
    \r
    return {\r
      key: year,\r
      year,\r
      months\r
    }\r
  })\r
  \r
  // 按年份倒序排列\r
  result.sort((a, b) => (a.year < b.year ? 1 : -1))\r
  \r
  return result\r
})\r
\r
// 格式化文章日期（只显示月日时分）\r
function formatPostDate(dateStr: string) {\r
  const d = new Date(dateStr)\r
  return d.toLocaleString('zh-CN', {\r
    month: 'short',\r
    day: 'numeric',\r
    hour: '2-digit',\r
    minute: '2-digit',\r
    hour12: false\r
  })\r
}\r
<\/script>\r
\r
<style scoped>\r
.archive-page {\r
  padding: 1rem;\r
  min-width: 900px;\r
  margin: 14px 50px;\r
}\r
\r
.container {\r
  background: linear-gradient(\r
    135deg,\r
    rgba(255, 255, 255, 0.9) 0%,\r
    rgba(255, 255, 255, 0.7) 100%\r
  );\r
  border-radius: 20px;\r
  padding: 2rem;\r
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.2);\r
  border: 2px solid rgba(255, 255, 255, 0.3);\r
  backdrop-filter: blur(15px);\r
  position: relative;\r
}\r
\r
h1 {\r
  margin: 0 0 0.5rem;\r
  color: #111827;\r
}\r
\r
.subtitle {\r
  margin: 0 0 2rem;\r
  color: #6b7280;\r
}\r
\r
.empty {\r
  color: #6b7280;\r
  text-align: center;\r
  padding: 2rem;\r
}\r
\r
/* 时间轴容器 */\r
.timeline {\r
  position: relative;\r
  padding-left: 120px;\r
  padding-top: 20px;\r
  padding-bottom: 20px;\r
}\r
\r
/* 绳子 */\r
.rope {\r
  position: absolute;\r
  left: 120px;\r
  top: 0;\r
  bottom: 0;\r
  width: 4px;\r
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);\r
  border-radius: 2px;\r
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);\r
}\r
\r
/* 时间轴项 */\r
.timeline-item {\r
  position: relative;\r
}\r
\r
/* 年份大锚点 */\r
.year-anchor {\r
  position: absolute;\r
  left: -130px;\r
  top: -2px;\r
  display: flex;\r
  align-items: center;\r
  width: 120px;\r
}\r
\r
.anchor-dot {\r
  background: #3b82f6;\r
  border-radius: 50%;\r
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);\r
  position: relative;\r
  z-index: 2;\r
}\r
\r
.anchor-dot.large {\r
  width: 24px;\r
  height: 24px;\r
  background-color: rgba(255, 167, 167, 0.749);\r
}\r
\r
.anchor-dot.small {\r
  width: 16px;\r
  height: 16px;\r
}\r
\r
.anchor-label {\r
  margin-left: 10px;\r
  font-weight: bold;\r
  color: #374151;\r
  white-space: nowrap;\r
}\r
\r
/* 月份部分 */\r
.month-section {\r
  margin-top: 0rem;\r
}\r
\r
/* 月份项 */\r
.month-item {\r
  position: relative;\r
  margin-bottom: 1.5rem;\r
}\r
\r
/* 月份小锚点 */\r
.month-anchor {\r
  position: absolute;\r
  left: -100px;\r
  top: 1rem;\r
  display: flex;\r
  align-items: center;\r
  width: 100px;\r
}\r
\r
/* 文章列表 */\r
.posts {\r
  margin-top: 0.5rem;\r
  margin-left: 20px;\r
  border-left: 2px dashed rgba(59, 130, 246, 0.3);\r
  padding-left: 20px;\r
}\r
\r
/* 文章项 */\r
.post-item {\r
  display: flex;\r
  align-items: flex-start;\r
  padding: 1rem 0;\r
  position: relative;\r
}\r
\r
.post-item:first-child {\r
  padding-top: 0;\r
}\r
\r
.post-item:last-child {\r
  padding-bottom: 0;\r
}\r
\r
/* 文章点 */\r
.post-dot {\r
  width: 10px;\r
  height: 10px;\r
  border-radius: 50%;\r
  background: #8b5cf6;\r
  position: absolute;\r
  left: -26px;\r
  top: 1.8rem;\r
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);\r
  z-index: 1;\r
}\r
\r
/* 文章内容 */\r
.post-content {\r
  flex: 1;\r
}\r
\r
.post-title {\r
  color: #2563eb;\r
  text-decoration: none;\r
  font-weight: 500;\r
  font-size: 1.1rem;\r
  display: block;\r
  margin-bottom: 0.5rem;\r
}\r
\r
.post-title:hover {\r
  text-decoration: underline;\r
}\r
\r
.post-meta {\r
  display: flex;\r
  align-items: center;\r
  gap: 1rem;\r
  font-size: 0.9rem;\r
}\r
\r
.post-date {\r
  color: #9ca3af;\r
  font-variant-numeric: tabular-nums;\r
}\r
\r
.post-tags {\r
  display: flex;\r
  gap: 0.5rem;\r
}\r
\r
.tag {\r
  color: #6b7280;\r
  background: rgba(107, 114, 128, 0.1);\r
  padding: 0.2rem 0.5rem;\r
  border-radius: 4px;\r
}\r
\r
/* 响应式设计 */\r
@media (max-width: 768px) {\r
  .archive-page {\r
    min-width: auto;\r
    margin: 14px;\r
  }\r
  \r
  .container {\r
    padding: 1.5rem;\r
  }\r
  \r
  .timeline {\r
    padding-left: 100px;\r
  }\r
  \r
  .rope {\r
    left: 100px;\r
  }\r
  \r
  .year-anchor {\r
    left: -100px;\r
    width: 100px;\r
  }\r
  \r
  .month-anchor {\r
    left: -80px;\r
    width: 80px;\r
  }\r
  \r
  .posts {\r
    margin-left: 15px;\r
    padding-left: 15px;\r
  }\r
  \r
  .post-dot {\r
    left: -21px;\r
    top: 1.8rem;\r
  }\r
  \r
  .year-anchor, .month-anchor {\r
    top: 1.2rem;\r
  }\r
}\r
</style>\r
\`\`\`\r
\r
## 动画效果实现\r
\r
我们使用framer-motion库为时间轴上的锚点添加交互动画效果：\r
\r
1. **导入motion组件**：\r
   \`\`\`typescript\r
   import { motion } from 'framer-motion'\r
   \`\`\`\r
\r
2. **为年份大锚点添加动画**：\r
   \`\`\`vue\r
   <motion.div \r
     class="anchor-dot large"\r
     :whileHover="{ scale: 1.2 }"\r
     :whileTap="{ scale: 0.9 }"\r
     :transition="{ type: 'spring', stiffness: 500 }"\r
   ></motion.div>\r
   \`\`\`\r
\r
3. **为月份小锚点添加动画**：\r
   \`\`\`vue\r
   <motion.div \r
     class="anchor-dot small"\r
     :whileHover="{ scale: 1.3 }"\r
     :whileTap="{ scale: 0.8 }"\r
     :transition="{ type: 'spring', stiffness: 500 }"\r
   ></motion.div>\r
   \`\`\`\r
\r
## 响应式设计\r
\r
为了确保归档页面在不同设备上都能良好显示，我们实现了响应式设计：\r
\r
\`\`\`css\r
@media (max-width: 768px) {\r
  .archive-page {\r
    min-width: auto;\r
    margin: 14px;\r
  }\r
  \r
  .container {\r
    padding: 1.5rem;\r
  }\r
  \r
  .timeline {\r
    padding-left: 100px;\r
  }\r
  \r
  .rope {\r
    left: 100px;\r
  }\r
  \r
  .year-anchor {\r
    left: -100px;\r
    width: 100px;\r
  }\r
  \r
  .month-anchor {\r
    left: -80px;\r
    width: 80px;\r
  }\r
  \r
  .posts {\r
    margin-left: 15px;\r
    padding-left: 15px;\r
  }\r
  \r
  .post-dot {\r
    left: -21px;\r
    top: 1.8rem;\r
  }\r
  \r
  .year-anchor, .month-anchor {\r
    top: 1.2rem;\r
  }\r
}\r
\`\`\`\r
\r
## 完整代码\r
\r
以上就是实现Vue3文章归档功能的完整步骤。最终效果包括：\r
1. 按年份和月份分组的文章时间轴\r
2. 绳子状的时间轴设计\r
3. 带有交互动画的锚点\r
4. 响应式布局适配不同设备\r
\r
通过以上步骤，你可以创建一个功能完整、视觉美观的文章归档页面。\r
`;export{r as default};
