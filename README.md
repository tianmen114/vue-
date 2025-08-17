# Vue 3 Markdown 博客管理系统

这是一个基于 Vue 3 + TypeScript + shadcn-vue 的现代化博客管理系统，支持自动扫描 Markdown 文件并生成路由。

## ✨ 功能特性

### 🚀 核心功能
- **自动文件扫描** - 自动扫描 `public/md` 文件夹中的 Markdown 文件
- **动态路由生成** - 根据文件名自动生成文章路由
- **YAML Front Matter 支持** - 支持文章元数据（标题、日期、标签、描述）
- **响应式设计** - 完美适配桌面端和移动端
- **现代化 UI** - 基于 shadcn-vue 的美观界面

### 📝 文章管理
- **文章列表** - 网格布局展示所有文章
- **搜索功能** - 支持标题、内容、标签搜索
- **标签筛选** - 按标签分类查看文章
- **文章详情** - 完整的 Markdown 渲染页面
- **文章导航** - 上一篇/下一篇文章切换

### 🎨 界面特色
- **毛玻璃效果** - 现代化的视觉设计
- **渐变色彩** - 丰富的色彩搭配
- **动画效果** - 流畅的交互动画
- **暗色主题** - 支持主题切换（待实现）

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: shadcn-vue
- **样式框架**: Tailwind CSS
- **Markdown 解析**: marked
- **路由管理**: Vue Router

## 📁 项目结构

```
vue-163-main/
├── public/
│   └── md/                    # Markdown 文件目录
│       ├── hello-world.md
│       ├── vue3-guide.md
│       └── typescript-tips.md
├── src/
│   ├── components/
│   │   ├── MdArticleList.vue  # 文章列表组件
│   │   ├── MdArticleDetail.vue # 文章详情组件
│   │   ├── BlogManager.vue    # 博客管理组件
│   │   └── ui/                # shadcn-vue 组件
│   ├── utils/
│   │   ├── mdLoader.ts        # Markdown 文件加载器
│   │   └── mdScanner.ts       # 文件扫描工具
│   ├── router/
│   │   └── index.ts           # 路由配置
│   └── App.vue                # 主应用组件
└── README.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 添加 Markdown 文件

在 `public/md/` 目录下创建 `.md` 文件，支持 YAML Front Matter：

```markdown
---
title: 文章标题
date: 2024-01-15
tags: 标签1, 标签2, 标签3
description: 文章描述
---

# 文章内容

这里是文章的 Markdown 内容...
```

### 4. 访问页面

- **文章列表**: `http://localhost:5173/articles`
- **博客管理**: `http://localhost:5173/blog-manager`
- **文章详情**: `http://localhost:5173/article/[文章ID]`

## 📝 Markdown 文件格式

### YAML Front Matter

每篇文章可以包含以下元数据：

```yaml
---
title: 文章标题
date: 2024-01-15
tags: Vue, 前端, 教程
description: 文章描述，用于列表页显示
---
```

### 支持的 Markdown 语法

- **标题**: `# ## ###`
- **列表**: `- * 1.`
- **链接**: `[文本](URL)`
- **图片**: `![alt](src)`
- **代码块**: ``` ``` ```
- **行内代码**: `code`
- **引用**: `> 引用内容`
- **表格**: `| 列1 | 列2 |`

## 🎯 使用指南

### 添加新文章

1. 在 `public/md/` 目录下创建新的 `.md` 文件
2. 添加 YAML Front Matter 元数据
3. 编写 Markdown 内容
4. 保存文件，系统会自动扫描并更新

### 文章管理

1. 访问 `/blog-manager` 页面
2. 查看文件统计和标签云
3. 在文件列表中管理文章
4. 点击"查看"预览文章，"编辑"修改文件

### 自定义样式

可以通过修改以下文件来自定义样式：

- `src/components/MdArticleList.vue` - 文章列表样式
- `src/components/MdArticleDetail.vue` - 文章详情样式
- `src/components/BlogManager.vue` - 管理页面样式

## 🔧 配置选项

### 修改扫描目录

在 `src/utils/mdLoader.ts` 中修改扫描路径：

```typescript
const mdModules = import.meta.glob('/public/md/**/*.md', { as: 'raw' })
```

### 自定义路由前缀

在 `src/router/index.ts` 中修改路由配置：

```typescript
{ path: '/articles', name: 'articles', component: MdArticleList },
{ path: '/article/:id', name: 'article', component: MdArticleDetail, props: true },
```

## 🎨 主题定制

### 颜色主题

项目使用 CSS 变量定义颜色，可以在 `src/assets/base.css` 中修改：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... 更多颜色变量 */
}
```

### 组件样式

所有组件都使用 Tailwind CSS 类名，可以直接修改或添加自定义样式。

## 📱 响应式设计

项目完全响应式，支持以下断点：

- **桌面端**: 1200px+
- **平板端**: 768px - 1199px
- **移动端**: < 768px

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

### 部署到静态服务器

将 `dist` 目录部署到任何静态文件服务器即可。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [shadcn-vue](https://www.shadcn-vue.com/) - 现代化 UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [marked](https://marked.js.org/) - Markdown 解析器

---

**享受写作的乐趣！** ✍️
