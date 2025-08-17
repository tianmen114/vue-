# Tianmen的个人博客

欢迎来到我的个人博客！这是一个基于Vue 3 + TypeScript + shadcn-vue构建的现代化博客系统。

## 🌟 博客特色

- **现代化界面设计**：采用毛玻璃效果和渐变色彩，提供美观的视觉体验
- **Markdown支持**：使用Markdown格式编写文章，支持代码高亮
- **自动文件扫描**：自动扫描`public/md`目录中的Markdown文件并生成文章列表
- **动态路由**：根据文件名自动生成文章路由
- **搜索功能**：支持按标题、内容和标签搜索文章
- **标签分类**：通过标签对文章进行分类管理
- **文章导航**：支持上一篇/下一篇文章快速切换

## 🛠️ 技术栈

- **前端框架**：Vue 3 (Composition API)
- **开发语言**：TypeScript
- **构建工具**：Vite
- **UI组件库**：shadcn-vue
- **样式框架**：Tailwind CSS
- **Markdown解析**：marked
- **路由管理**：Vue Router

## 📝 主要功能

### 文章管理
- 文章列表展示
- 文章详情页面
- 按标签筛选文章
- 全文搜索功能

### 界面设计
- 毛玻璃效果
- 渐变色彩搭配
- 流畅的交互动画
- 响应式设计

## 📁 项目结构

```
vue-blog/
├── public/
│   └── md/           # Markdown文章目录
├── src/
│   ├── components/   # Vue组件
│   ├── utils/        # 工具函数
│   ├── router/       # 路由配置
│   └── App.vue       # 主应用组件
└── README.md         # 项目说明文档
```

## 🚀 快速开始

1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 在`public/md/`目录下添加Markdown文件
4. 访问`http://localhost:5173`查看博客
