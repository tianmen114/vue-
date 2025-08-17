const r=`---\r
title: 封面测试\r
date: 2025-01-16\r
tags: [测试, 封面]\r
description: 测试封面图片功能\r
mdimg: https://tu.tianmen15qwq.dpdns.org/file/4a6d1a19070b86ca08f28.jpg\r
top: 100\r
---\r
# Vue Markdown 文章处理程序详细实现指南\r
\r
## 1. 项目概述\r
\r
本项目是一个基于 Vue 3 的博客系统，可以加载和显示 Markdown 格式的文章。我们为这个系统添加了文章置顶功能，让重要的文章可以显示在列表的最前面。\r
\r
## 2. 核心概念解释\r
\r
### 2.1 什么是 Markdown？\r
Markdown 是一种轻量级的标记语言，可以用来编写文档。它使用简单的符号来标记标题、列表、链接等元素。\r
\r
### 2.2 什么是 YAML front matter？\r
YAML front matter 是 Markdown 文件顶部的一段特殊区域，用三个短横线 \`---\` 包围，用来存储文章的元数据（如标题、日期、标签等）。\r
\r
### 2.3 什么是置顶功能？\r
置顶功能允许我们为某些重要文章设置一个优先级数字，数字越大文章越靠前显示。\r
\r
## 3. 一步步实现文章处理程序\r
\r
### 3.1 第一步：定义文章数据结构\r
\r
我们首先需要定义一个接口来描述文章包含哪些信息。\r
\r
文件：\`src/utils/mdLoader.ts\`\r
\r
\`\`\`typescript\r
// Markdown 文件接口\r
export interface MdFile {\r
  id: string        // 文章唯一标识符\r
  title: string     // 文章标题\r
  content: string   // 文章正文内容\r
  path: string      // 文章文件路径\r
  date: string      // 文章发布日期\r
  tags: string[]    // 文章标签列表\r
  description: string  // 文章描述\r
  cover?: string    // 文章封面图片（可选）\r
  top?: number      // 文章置顶优先级（可选，数字越大越靠前）\r
}\r
\`\`\`\r
\r
### 3.2 第二步：解析 Markdown 文件\r
\r
我们需要一个函数来读取 Markdown 文件并提取其中的信息。\r
\r
文件：\`src/utils/mdLoader.ts\`\r
\r
\`\`\`typescript\r
// 解析 Markdown 文件内容\r
export function parseMdContent(content: string): Partial<MdFile> {\r
  const lines = content.split('\\n')\r
  const metadata: Partial<MdFile> = {}\r
  \r
  // 查找 YAML front matter\r
  if (lines[0]?.trim() === '---') {\r
    let i = 1\r
    while (i < lines.length && lines[i]?.trim() !== '---') {\r
      const line = lines[i]\r
      const colonIndex = line.indexOf(':')\r
      if (colonIndex > 0) {\r
        const key = line.substring(0, colonIndex).trim()\r
        const value = line.substring(colonIndex + 1).trim()\r
        \r
        switch (key) {\r
          case 'title':\r
            metadata.title = value\r
            break\r
          case 'date':\r
            metadata.date = value\r
            break\r
          case 'tags':\r
            metadata.tags = value.split(',').map(tag => tag.trim())\r
            break\r
          case 'description':\r
            metadata.description = value\r
            break\r
          case 'mdimg':\r
          case 'cover':\r
            metadata.cover = value\r
            break\r
          case 'top':  // 解析 top 字段\r
            const topValue = parseInt(value, 10)\r
            if (!isNaN(topValue)) {\r
              metadata.top = topValue\r
            }\r
            break\r
        }\r
      }\r
      i++\r
    }\r
    \r
    // 提取正文内容（跳过 front matter）\r
    const contentStart = i + 1\r
    metadata.content = lines.slice(contentStart).join('\\n')\r
  } else {\r
    // 没有 front matter，整个内容都是正文\r
    metadata.content = content\r
  }\r
  \r
  return metadata\r
}\r
\`\`\`\r
\r
### 3.3 第三步：加载所有文章\r
\r
我们需要一个函数来扫描项目中的所有 Markdown 文件并加载它们。\r
\r
文件：\`src/utils/mdLoader.ts\`\r
\r
\`\`\`typescript\r
// 获取所有 Markdown 文件（自动扫描）\r
export async function loadAllMdFiles(): Promise<MdFile[]> {\r
  const files: MdFile[] = []\r
  \r
  try {\r
    // 使用 Vite 的 import.meta.glob 自动扫描所有 .md 文件\r
    const mdModules = import.meta.glob('/public/md/**/*.md', { as: 'raw' })\r
    \r
    for (const path in mdModules) {\r
      try {\r
        const content = await mdModules[path]()\r
        const parsed = parseMdContent(content)\r
        const id = generateFileId(path)\r
        \r
        // 转换为相对路径格式（去掉 /public 前缀）\r
        const relativePath = path.replace('/public', '')\r
        \r
        files.push({\r
          id,\r
          title: parsed.title || extractTitle(content),\r
          content: parsed.content || content,\r
          path: relativePath,\r
          date: ensureIsoWithTime(parsed.date),\r
          tags: parsed.tags || [],\r
          description: parsed.description || extractDescription(content),\r
          cover: parsed.cover,\r
          top: parsed.top  // 包含 top 属性\r
        })\r
      } catch (error) {\r
        console.error(\`Failed to load file: \${path}\`, error)\r
      }\r
    }\r
    \r
    mdFiles.value = files\r
    return files\r
  } catch (error) {\r
    console.error('Failed to load markdown files:', error)\r
    return []\r
  }\r
}\r
\`\`\`\r
\r
### 3.4 第四步：实现文章排序逻辑\r
\r
我们需要实现一个排序函数，让置顶文章（top 值高的文章）显示在列表前面。\r
\r
这个排序逻辑在三个不同的组件中都有实现：\r
\r
#### 3.4.1 首页组件排序\r
\r
文件：\`src/components/home.vue\`\r
\r
\`\`\`typescript\r
async function loadArticles() {\r
  loading.value = true\r
  error.value = ''\r
\r
  try {\r
    await loadAllMdFiles()\r
    // 按 top 值和日期排序文章\r
    mdFiles.value.sort((a, b) => {\r
      // 首先按 top 值降序排序（数值大的在前）\r
      if (a.top !== undefined && b.top !== undefined) {\r
        if (a.top !== b.top) {\r
          return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前\r
        }\r
      } else if (a.top !== undefined) {\r
        return -1  // a 有 top 值，排在前面\r
      } else if (b.top !== undefined) {\r
        return 1   // b 有 top 值，排在前面\r
      }\r
      \r
      // top 值相同的或都没有 top 值的，按日期降序排序\r
      return new Date(b.date).getTime() - new Date(a.date).getTime()\r
    })\r
  } catch (err) {\r
    error.value = err instanceof Error ? err.message : '加载文章失败'\r
  } finally {\r
    loading.value = false\r
  }\r
}\r
\`\`\`\r
\r
#### 3.4.2 文章列表组件排序\r
\r
文件：\`src/components/MdArticleList.vue\`\r
\r
\`\`\`typescript\r
// 过滤文章\r
const filteredArticles = computed(() => {\r
  let articles = mdFiles.value\r
  \r
  // 按标签过滤\r
  if (selectedTag.value) {\r
    articles = getMdFilesByTag(selectedTag.value)\r
  }\r
  \r
  // 按搜索词过滤\r
  if (searchQuery.value) {\r
    articles = searchMdFiles(searchQuery.value)\r
  }\r
  \r
  return articles.sort((a, b) => {\r
    // 首先按 top 值降序排序（数值大的在前）\r
    if (a.top !== undefined && b.top !== undefined) {\r
      if (a.top !== b.top) {\r
        return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前\r
      }\r
    } else if (a.top !== undefined) {\r
      return -1  // a 有 top 值，排在前面\r
    } else if (b.top !== undefined) {\r
      return 1   // b 有 top 值，排在前面\r
    }\r
    \r
    // top 值相同的或都没有 top 值的，按日期降序排序\r
    return new Date(b.date).getTime() - new Date(a.date).getTime()\r
  })\r
})\r
\`\`\`\r
\r
#### 3.4.3 简单文章列表组件排序\r
\r
文件：\`src/components/SimpleArticleList.vue\`\r
\r
\`\`\`typescript\r
// 计算属性：排序后的文章列表\r
const sortedArticles = computed(() => {\r
  return [...mdFiles.value].sort((a, b) => {\r
    // 首先按 top 值降序排序（数值大的在前）\r
    if (a.top !== undefined && b.top !== undefined) {\r
      if (a.top !== b.top) {\r
        return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前\r
      }\r
    } else if (a.top !== undefined) {\r
      return -1  // a 有 top 值，排在前面\r
    } else if (b.top !== undefined) {\r
      return 1   // b 有 top 值，排在前面\r
    }\r
    \r
    // top 值相同的或都没有 top 值的，按日期降序排序\r
    return new Date(b.date).getTime() - new Date(a.date).getTime()\r
  })\r
})\r
\`\`\`\r
\r
### 3.5 第五步：显示置顶标签\r
\r
为了让用户知道哪些文章是置顶的，我们在文章标题旁边添加了"置顶"标签。\r
\r
#### 3.5.1 首页组件显示置顶标签\r
\r
文件：\`src/components/home.vue\`\r
\r
\`\`\`vue\r
<h3>\r
  {{ article.title }}\r
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>\r
  <div class="xiaobiao"> &nbsp;></div>\r
</h3>\r
\`\`\`\r
\r
#### 3.5.2 文章列表组件显示置顶标签\r
\r
文件：\`src/components/MdArticleList.vue\`\r
\r
\`\`\`vue\r
<CardTitle>\r
  {{ article.title }}\r
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>\r
</CardTitle>\r
\`\`\`\r
\r
#### 3.5.3 简单文章列表组件显示置顶标签\r
\r
文件：\`src/components/SimpleArticleList.vue\`\r
\r
\`\`\`vue\r
<h3>\r
  {{ article.title }}\r
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>\r
</h3>\r
\`\`\`\r
\r
### 3.6 第六步：添加置顶标签样式\r
\r
为了让"置顶"标签看起来更美观，我们为它添加了专门的 CSS 样式。\r
\r
#### 3.6.1 首页组件样式\r
\r
文件：\`src/components/home.vue\`\r
\r
\`\`\`css\r
.top-tag {\r
  display: inline-block;\r
  color: rgb(207, 108, 127);;\r
  padding: 0.25rem 0.5rem;\r
  border-radius: 4px;\r
  font-size: 0.75rem;\r
  font-weight: bold;\r
  margin-left: 0.5rem;\r
  vertical-align: middle;\r
}\r
\`\`\`\r
\r
#### 3.6.2 文章列表组件样式\r
\r
文件：\`src/components/MdArticleList.vue\`\r
\r
\`\`\`css\r
.top-tag {\r
  display: inline-block;\r
  background: linear-gradient(135deg, #ff69b4, #ff1493);\r
  color: white;\r
  padding: 0.25rem 0.5rem;\r
  border-radius: 4px;\r
  font-size: 0.75rem;\r
  font-weight: bold;\r
  margin-left: 0.5rem;\r
  vertical-align: middle;\r
}\r
\`\`\`\r
\r
#### 3.6.3 简单文章列表组件样式\r
\r
文件：\`src/components/SimpleArticleList.vue\`\r
\r
\`\`\`css\r
.top-tag {\r
  display: inline-block;\r
  background: linear-gradient(135deg, #ff69b4, #ff1493);\r
  color: white;\r
  padding: 0.25rem 0.5rem;\r
  border-radius: 4px;\r
  font-size: 0.75rem;\r
  font-weight: bold;\r
  margin-left: 0.5rem;\r
  vertical-align: middle;\r
}\r
\`\`\`\r
\r
## 4. 如何使用置顶功能\r
\r
### 4.1 创建置顶文章\r
\r
要创建一个置顶文章，只需要在 Markdown 文件的 front matter 中添加 \`top\` 字段：\r
\r
\`\`\`markdown\r
---\r
title: 这是一篇置顶文章\r
date: 2024-01-20\r
tags: 示例, 置顶\r
description: 这是一篇置顶文章的描述\r
top: 100\r
---\r
\r
# 这是一篇置顶文章\r
\r
这是文章的正文内容...\r
\`\`\`\r
\r
### 4.2 置顶优先级说明\r
\r
- \`top\` 值越大，文章越靠前\r
- 没有设置 \`top\` 字段的文章会按日期排序显示在置顶文章之后\r
- 如果多篇文章有相同的 \`top\` 值，则按日期排序\r
\r
### 4.3 示例文章\r
\r
我们创建了两个示例文章来测试置顶功能：\r
\r
#### \`public/md/pinned-article.md\`\r
\r
\`\`\`markdown\r
---\r
title: 置顶文章测试\r
date: 2024-01-20T10:00:00\r
tags: 测试, 置顶\r
description: 这是一篇用于测试置顶功能的文章。\r
top: 100\r
---\r
\r
# 置顶文章测试\r
\r
这是一篇用于测试置顶功能的文章。\r
\`\`\`\r
\r
#### \`public/md/another-pinned-article.md\`\r
\r
\`\`\`markdown\r
---\r
title: 另一篇置顶文章测试\r
date: 2024-01-18T10:00:00\r
tags: 测试, 置顶\r
description: 这是另一篇用于测试置顶功能的文章，top 值较小。\r
top: 50\r
---\r
\r
# 另一篇置顶文章测试\r
\r
这是另一篇用于测试置顶功能的文章，top 值较小。\r
\`\`\`\r
\r
## 5. 总结\r
\r
通过以上步骤，我们成功地为项目添加了 Markdown 文章置顶功能。整个实现过程包括：\r
\r
1. 在文章数据结构中添加 \`top\` 字段\r
2. 修改 Markdown 解析器以支持 \`top\` 字段\r
3. 在文章加载器中正确处理 \`top\` 字段\r
4. 在所有文章列表组件中实现按 \`top\` 值排序的逻辑\r
5. 在前端界面中显示"置顶"标签\r
6. 为"置顶"标签添加美观的样式\r
\r
现在，当您创建文章时，只需在 front matter 中添加 \`top\` 字段并设置一个数值，这篇文章就会根据数值大小显示在文章列表的相应位置。`;export{r as default};
