# Vue 项目中 Markdown 文章处理程序详细实现指南

## 1. 项目概述

本项目是一个基于 Vue 3 的博客系统，可以加载和显示 Markdown 格式的文章。我们为这个系统添加了文章置顶功能，让重要的文章可以显示在列表的最前面。

## 2. 核心概念解释

### 2.1 什么是 Markdown？
Markdown 是一种轻量级的标记语言，可以用来编写文档。它使用简单的符号来标记标题、列表、链接等元素。

### 2.2 什么是 YAML front matter？
YAML front matter 是 Markdown 文件顶部的一段特殊区域，用三个短横线 `---` 包围，用来存储文章的元数据（如标题、日期、标签等）。

### 2.3 什么是置顶功能？
置顶功能允许我们为某些重要文章设置一个优先级数字，数字越大文章越靠前显示。

## 3. 一步步实现文章处理程序

### 3.1 第一步：定义文章数据结构

我们首先需要定义一个接口来描述文章包含哪些信息。

文件：`src/utils/mdLoader.ts`

```typescript
// Markdown 文件接口
export interface MdFile {
  id: string        // 文章唯一标识符
  title: string     // 文章标题
  content: string   // 文章正文内容
  path: string      // 文章文件路径
  date: string      // 文章发布日期
  tags: string[]    // 文章标签列表
  description: string  // 文章描述
  cover?: string    // 文章封面图片（可选）
  top?: number      // 文章置顶优先级（可选，数字越大越靠前）
}
```

### 3.2 第二步：解析 Markdown 文件

我们需要一个函数来读取 Markdown 文件并提取其中的信息。

文件：`src/utils/mdLoader.ts`

```typescript
// 解析 Markdown 文件内容
export function parseMdContent(content: string): Partial<MdFile> {
  const lines = content.split('\n')
  const metadata: Partial<MdFile> = {}
  
  // 查找 YAML front matter
  if (lines[0]?.trim() === '---') {
    let i = 1
    while (i < lines.length && lines[i]?.trim() !== '---') {
      const line = lines[i]
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        
        switch (key) {
          case 'title':
            metadata.title = value
            break
          case 'date':
            metadata.date = value
            break
          case 'tags':
            metadata.tags = value.split(',').map(tag => tag.trim())
            break
          case 'description':
            metadata.description = value
            break
          case 'mdimg':
          case 'cover':
            metadata.cover = value
            break
          case 'top':  // 解析 top 字段
            const topValue = parseInt(value, 10)
            if (!isNaN(topValue)) {
              metadata.top = topValue
            }
            break
        }
      }
      i++
    }
    
    // 提取正文内容（跳过 front matter）
    const contentStart = i + 1
    metadata.content = lines.slice(contentStart).join('\n')
  } else {
    // 没有 front matter，整个内容都是正文
    metadata.content = content
  }
  
  return metadata
}
```

### 3.3 第三步：加载所有文章

我们需要一个函数来扫描项目中的所有 Markdown 文件并加载它们。

文件：`src/utils/mdLoader.ts`

```typescript
// 获取所有 Markdown 文件（自动扫描）
export async function loadAllMdFiles(): Promise<MdFile[]> {
  const files: MdFile[] = []
  
  try {
    // 使用 Vite 的 import.meta.glob 自动扫描所有 .md 文件
    const mdModules = import.meta.glob('/public/md/**/*.md', { as: 'raw' })
    
    for (const path in mdModules) {
      try {
        const content = await mdModules[path]()
        const parsed = parseMdContent(content)
        const id = generateFileId(path)
        
        // 转换为相对路径格式（去掉 /public 前缀）
        const relativePath = path.replace('/public', '')
        
        files.push({
          id,
          title: parsed.title || extractTitle(content),
          content: parsed.content || content,
          path: relativePath,
          date: ensureIsoWithTime(parsed.date),
          tags: parsed.tags || [],
          description: parsed.description || extractDescription(content),
          cover: parsed.cover,
          top: parsed.top  // 包含 top 属性
        })
      } catch (error) {
        console.error(`Failed to load file: ${path}`, error)
      }
    }
    
    mdFiles.value = files
    return files
  } catch (error) {
    console.error('Failed to load markdown files:', error)
    return []
  }
}
```

### 3.4 第四步：实现文章排序逻辑

我们需要实现一个排序函数，让置顶文章（top 值高的文章）显示在列表前面。

这个排序逻辑在三个不同的组件中都有实现：

#### 3.4.1 首页组件排序

文件：`src/components/home.vue`

```typescript
async function loadArticles() {
  loading.value = true
  error.value = ''

  try {
    await loadAllMdFiles()
    // 按 top 值和日期排序文章
    mdFiles.value.sort((a, b) => {
      // 首先按 top 值降序排序（数值大的在前）
      if (a.top !== undefined && b.top !== undefined) {
        if (a.top !== b.top) {
          return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前
        }
      } else if (a.top !== undefined) {
        return -1  // a 有 top 值，排在前面
      } else if (b.top !== undefined) {
        return 1   // b 有 top 值，排在前面
      }
      
      // top 值相同的或都没有 top 值的，按日期降序排序
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载文章失败'
  } finally {
    loading.value = false
  }
}
```

#### 3.4.2 文章列表组件排序

文件：`src/components/MdArticleList.vue`

```typescript
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
        return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前
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
```

#### 3.4.3 简单文章列表组件排序

文件：`src/components/SimpleArticleList.vue`

```typescript
// 计算属性：排序后的文章列表
const sortedArticles = computed(() => {
  return [...mdFiles.value].sort((a, b) => {
    // 首先按 top 值降序排序（数值大的在前）
    if (a.top !== undefined && b.top !== undefined) {
      if (a.top !== b.top) {
        return b.top - a.top  // 注意这里是 b.top - a.top，确保大的在前
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
```

### 3.5 第五步：显示置顶标签

为了让用户知道哪些文章是置顶的，我们在文章标题旁边添加了"置顶"标签。

#### 3.5.1 首页组件显示置顶标签

文件：`src/components/home.vue`

```vue
<h3>
  {{ article.title }}
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>
  <div class="xiaobiao"> &nbsp;></div>
</h3>
```

#### 3.5.2 文章列表组件显示置顶标签

文件：`src/components/MdArticleList.vue`

```vue
<CardTitle>
  {{ article.title }}
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>
</CardTitle>
```

#### 3.5.3 简单文章列表组件显示置顶标签

文件：`src/components/SimpleArticleList.vue`

```vue
<h3>
  {{ article.title }}
  <span v-if="article.top !== undefined" class="top-tag">置顶</span>
</h3>
```

### 3.6 第六步：添加置顶标签样式

为了让"置顶"标签看起来更美观，我们为它添加了专门的 CSS 样式。

#### 3.6.1 首页组件样式

文件：`src/components/home.vue`

```css
.top-tag {
  display: inline-block;
  color: rgb(207, 108, 127);;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-left: 0.5rem;
  vertical-align: middle;
}
```

#### 3.6.2 文章列表组件样式

文件：`src/components/MdArticleList.vue`

```css
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
```

#### 3.6.3 简单文章列表组件样式

文件：`src/components/SimpleArticleList.vue`

```css
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
```

## 4. 如何使用置顶功能

### 4.1 创建置顶文章

要创建一个置顶文章，只需要在 Markdown 文件的 front matter 中添加 `top` 字段：

```markdown
---
title: 这是一篇置顶文章
date: 2024-01-20
tags: 示例, 置顶
description: 这是一篇置顶文章的描述
top: 100
---

# 这是一篇置顶文章

这是文章的正文内容...
```

### 4.2 置顶优先级说明

- `top` 值越大，文章越靠前
- 没有设置 `top` 字段的文章会按日期排序显示在置顶文章之后
- 如果多篇文章有相同的 `top` 值，则按日期排序

### 4.3 示例文章

我们创建了两个示例文章来测试置顶功能：

#### `public/md/pinned-article.md`

```markdown
---
title: 置顶文章测试
date: 2024-01-20T10:00:00
tags: 测试, 置顶
description: 这是一篇用于测试置顶功能的文章。
top: 100
---

# 置顶文章测试

这是一篇用于测试置顶功能的文章。
```

#### `public/md/another-pinned-article.md`

```markdown
---
title: 另一篇置顶文章测试
date: 2024-01-18T10:00:00
tags: 测试, 置顶
description: 这是另一篇用于测试置顶功能的文章，top 值较小。
top: 50
---

# 另一篇置顶文章测试

这是另一篇用于测试置顶功能的文章，top 值较小。
```

## 5. 总结

通过以上步骤，我们成功地为项目添加了 Markdown 文章置顶功能。整个实现过程包括：

1. 在文章数据结构中添加 `top` 字段
2. 修改 Markdown 解析器以支持 `top` 字段
3. 在文章加载器中正确处理 `top` 字段
4. 在所有文章列表组件中实现按 `top` 值排序的逻辑
5. 在前端界面中显示"置顶"标签
6. 为"置顶"标签添加美观的样式

现在，当您创建文章时，只需在 front matter 中添加 `top` 字段并设置一个数值，这篇文章就会根据数值大小显示在文章列表的相应位置。
