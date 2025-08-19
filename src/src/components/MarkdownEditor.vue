<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <!-- 编辑区域 -->
      <div class="editor-panel">
        <textarea 
          v-model="markdownContent" 
          @input="handleInput"
          placeholder="请输入Markdown内容..."
          class="editor-textarea"
        ></textarea>
      </div>
      
      <!-- 预览区域 -->
      <div class="preview-panel" ref="previewPanel">
        <div class="preview-content" v-html="renderedMarkdown"></div>
      </div>
    </div>
    
    <!-- 右侧导航面板 -->
    <div class="toc-panel" ref="tocPanel">
      <h3>目录</h3>
      <ul class="toc-list">
        <li 
          v-for="heading in headings" 
          :key="heading.id"
          :class="['toc-item', `toc-level-${heading.level}`, { 'active': activeHeadingId === heading.id }]"
          @click="scrollToHeading(heading.id)"
        >
          <a href="javascript:void(0)">{{ heading.text }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { marked, Renderer } from 'marked';

// 自定义渲染器，为标题添加ID
const renderer = new Renderer();
renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
};

// 配置marked选项
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
});

// 响应式数据
const markdownContent = ref('');
const previewPanel = ref<HTMLElement | null>(null);
const tocPanel = ref<HTMLElement | null>(null);
const activeHeadingId = ref('');
const headings = ref<Array<{id: string, text: string, level: number}>>([]);

// 渲染Markdown内容
const renderedMarkdown = computed(() => {
  return marked.parse(markdownContent.value);
});

// 处理输入事件
const handleInput = () => {
  // 重新生成目录
  generateTableOfContents();
};

// 生成目录
const generateTableOfContents = () => {
  // 清空现有目录
  headings.value = [];
  
  // 使用marked的lexer解析Markdown内容
  const tokens = marked.lexer(markdownContent.value);
  
  // 遍历tokens，提取标题
  tokens.forEach(token => {
    if (token.type === 'heading') {
      // 使用标题文本生成ID，与渲染器保持一致
      const id = token.text.toLowerCase().replace(/[^\w]+/g, '-');
      headings.value.push({
        id,
        text: token.text,
        level: token.depth
      });
    }
  });
};

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  if (previewPanel.value) {
    const element = previewPanel.value.querySelector(`#${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      activeHeadingId.value = id;
    }
  }
};

// 监听滚动事件，更新当前活动标题
const handleScroll = () => {
  if (!previewPanel.value) return;
  
  const headings = previewPanel.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let currentHeadingId = '';
  
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    const rect = heading.getBoundingClientRect();
    
    if (rect.top <= 100) { // 当标题距离顶部100px时视为当前活动标题
      currentHeadingId = heading.id;
      break;
    }
  }
  
  activeHeadingId.value = currentHeadingId;
};

// 组件挂载时添加滚动监听
onMounted(() => {
  if (previewPanel.value) {
    previewPanel.value.addEventListener('scroll', handleScroll);
  }
  
  // 初始化一些示例内容
  markdownContent.value = `# 欢迎使用Markdown编辑器

## 简介
这是一个功能强大的Markdown编辑器，支持实时预览和自动目录生成功能。

## 功能特点
- 实时预览
- 自动生成目录
- 平滑滚动导航
- 响应式设计

## 使用说明
1. 在左侧编辑区域输入Markdown内容
2. 右侧会实时显示渲染效果
3. 点击右侧目录可快速跳转到相应章节

### 支持的语法
- **粗体文本**
- *斜体文本*
- \`行内代码\`
- [链接](https://example.com)
- 列表项

## 示例代码
\`\`\`javascript
console.log('Hello, Markdown!');
\`\`\`

## 表格示例
| 姓名 | 年龄 | 城市 |
| ---- | ---- | ---- |
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |

## 结语
希望您喜欢这个Markdown编辑器！
`;
  
  // 生成初始目录
  generateTableOfContents();
});

// 组件卸载前移除滚动监听
onBeforeUnmount(() => {
  if (previewPanel.value) {
    previewPanel.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.markdown-editor {
  display: flex;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.editor-container {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
}

.editor-textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.preview-panel {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.preview-content {
  line-height: 1.6;
}

.preview-content h1,
.preview-content h2,
.preview-content h3,
.preview-content h4,
.preview-content h5,
.preview-content h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.preview-content h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview-content h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview-content h3 {
  font-size: 1.25em;
}

.preview-content h4 {
  font-size: 1em;
}

.preview-content h5 {
  font-size: 0.875em;
}

.preview-content h6 {
  font-size: 0.85em;
  color: #6a737d;
}

.preview-content p {
  margin-top: 0;
  margin-bottom: 16px;
}

.preview-content a {
  color: #0366d6;
  text-decoration: none;
}

.preview-content a:hover {
  text-decoration: underline;
}

.preview-content strong {
  font-weight: 600;
}

.preview-content em {
  font-style: italic;
}

.preview-content code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.preview-content pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.preview-content pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  background-color: transparent;
}

.preview-content ul,
.preview-content ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.preview-content li {
  margin-bottom: 4px;
}

.preview-content li > p {
  margin-top: 16px;
}

.preview-content table {
  display: block;
  width: 100%;
  overflow: auto;
  border-collapse: collapse;
}

.preview-content table th {
  font-weight: 600;
}

.preview-content table th,
.preview-content table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.preview-content table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.preview-content table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.toc-panel {
  width: 250px;
  padding: 20px;
  border-left: 1px solid #ddd;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.toc-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-item a {
  display: block;
  padding: 5px 10px;
  color: #212529;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toc-item a:hover {
  background-color: #e9ecef;
}

.toc-item.active a {
  background-color: #007bff;
  color: #fff;
}

.toc-level-1 a {
  padding-left: 10px;
  font-weight: 600;
}

.toc-level-2 a {
  padding-left: 25px;
  font-weight: 500;
}

.toc-level-3 a {
  padding-left: 40px;
}

.toc-level-4 a {
  padding-left: 55px;
}

.toc-level-5 a {
  padding-left: 70px;
}

.toc-level-6 a {
  padding-left: 85px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-editor {
    flex-direction: column;
    padding: 10px;
  }
  
  .editor-container {
    flex-direction: column;
  }
  
  .toc-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #ddd;
    margin-top: 20px;
  }
}
</style>