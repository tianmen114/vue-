const n=`---\r
title: Vue 3 完全指南 - 从入门到精通\r
date: 2024-01-20T09:00:00\r
tags: Vue, 前端, 教程\r
description: 深入浅出 Vue 3，从基础概念到高级特性，带你掌握现代前端开发。\r
---\r
\r
# Vue 3 完全指南 - 从入门到精通\r
\r
Vue 3 是 Vue.js 的最新主要版本，带来了许多激动人心的新特性和改进。本文将带你深入了解 Vue 3 的核心概念和最佳实践。\r
\r
## Vue 3 的新特性\r
\r
### 1. Composition API\r
\r
Composition API 是 Vue 3 最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑：\r
\r
\`\`\`vue\r
<template>\r
  <div>\r
    <h1>{{ title }}</h1>\r
    <p>计数: {{ count }}</p>\r
    <button @click="increment">增加</button>\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, computed } from 'vue'\r
\r
// 响应式数据\r
const count = ref(0)\r
const title = ref('Vue 3 示例')\r
\r
// 计算属性\r
const doubleCount = computed(() => count.value * 2)\r
\r
// 方法\r
const increment = () => {\r
  count.value++\r
}\r
<\/script>\r
\`\`\`\r
\r
### 2. 更好的 TypeScript 支持\r
\r
Vue 3 使用 TypeScript 重写，提供了更好的类型推断：\r
\r
\`\`\`typescript\r
interface User {\r
  id: number\r
  name: string\r
  email: string\r
}\r
\r
const user = ref<User>({\r
  id: 1,\r
  name: '张三',\r
  email: 'zhangsan@example.com'\r
})\r
\`\`\`\r
\r
### 3. 性能提升\r
\r
Vue 3 在性能方面有显著提升：\r
\r
- **更小的包体积**: 通过 tree-shaking 优化\r
- **更快的渲染**: 新的虚拟 DOM 实现\r
- **更好的内存使用**: 更高效的响应式系统\r
\r
## 响应式系统\r
\r
Vue 3 的响应式系统基于 ES6 的 Proxy，提供了更好的性能和功能：\r
\r
\`\`\`javascript\r
import { reactive, ref, computed, watch } from 'vue'\r
\r
// 对象响应式\r
const state = reactive({\r
  count: 0,\r
  name: 'Vue 3'\r
})\r
\r
// 基本类型响应式\r
const count = ref(0)\r
\r
// 计算属性\r
const doubleCount = computed(() => count.value * 2)\r
\r
// 监听器\r
watch(count, (newValue, oldValue) => {\r
  console.log(\`计数从 \${oldValue} 变为 \${newValue}\`)\r
})\r
\`\`\`\r
\r
## 生命周期钩子\r
\r
在 Composition API 中，生命周期钩子以 \`on\` 开头：\r
\r
\`\`\`javascript\r
import { onMounted, onUnmounted, onUpdated } from 'vue'\r
\r
onMounted(() => {\r
  console.log('组件已挂载')\r
})\r
\r
onUpdated(() => {\r
  console.log('组件已更新')\r
})\r
\r
onUnmounted(() => {\r
  console.log('组件已卸载')\r
})\r
\`\`\`\r
\r
## 最佳实践\r
\r
### 1. 使用 \`<script setup>\`\r
\r
\`<script setup>\` 是 Vue 3 推荐的语法糖：\r
\r
\`\`\`vue\r
<script setup>\r
// 导入的组件自动注册\r
import MyComponent from './MyComponent.vue'\r
\r
// 顶层的变量和函数自动暴露给模板\r
const message = 'Hello Vue 3!'\r
const handleClick = () => {\r
  console.log('点击了按钮')\r
}\r
<\/script>\r
\`\`\`\r
\r
### 2. 组合式函数 (Composables)\r
\r
将可复用的逻辑提取为组合式函数：\r
\r
\`\`\`javascript\r
// useCounter.js\r
import { ref, computed } from 'vue'\r
\r
export function useCounter(initialValue = 0) {\r
  const count = ref(initialValue)\r
  \r
  const increment = () => count.value++\r
  const decrement = () => count.value--\r
  const double = computed(() => count.value * 2)\r
  \r
  return {\r
    count,\r
    increment,\r
    decrement,\r
    double\r
  }\r
}\r
\`\`\`\r
\r
### 3. 类型安全\r
\r
充分利用 TypeScript 的类型系统：\r
\r
\`\`\`typescript\r
// 定义 Props 类型\r
interface Props {\r
  title: string\r
  count?: number\r
}\r
\r
// 定义 Emits 类型\r
interface Emits {\r
  (e: 'update', value: number): void\r
  (e: 'delete'): void\r
}\r
\r
// 使用 defineProps 和 defineEmits\r
const props = defineProps<Props>()\r
const emit = defineEmits<Emits>()\r
\`\`\`\r
\r
## 迁移指南\r
\r
如果你正在从 Vue 2 迁移到 Vue 3，以下是一些关键点：\r
\r
### 1. 全局 API 变化\r
\r
\`\`\`javascript\r
// Vue 2\r
Vue.use(router)\r
Vue.component('MyComponent', MyComponent)\r
\r
// Vue 3\r
import { createApp } from 'vue'\r
const app = createApp(App)\r
app.use(router)\r
app.component('MyComponent', MyComponent)\r
\`\`\`\r
\r
### 2. 事件系统\r
\r
\`\`\`javascript\r
// Vue 2\r
this.$emit('update', value)\r
\r
// Vue 3\r
const emit = defineEmits(['update'])\r
emit('update', value)\r
\`\`\`\r
\r
### 3. 过滤器移除\r
\r
Vue 3 移除了过滤器，建议使用计算属性或方法：\r
\r
\`\`\`javascript\r
// Vue 2\r
{{ message | capitalize }}\r
\r
// Vue 3\r
{{ capitalize(message) }}\r
\`\`\`\r
\r
## 总结\r
\r
Vue 3 带来了许多激动人心的新特性，使开发体验更加流畅和高效。通过掌握 Composition API、TypeScript 支持和性能优化，你可以构建更强大、更可维护的应用程序。\r
\r
记住，学习 Vue 3 是一个渐进的过程，建议：\r
\r
1. 先熟悉 Composition API 的基本概念\r
2. 逐步迁移现有项目\r
3. 充分利用 TypeScript 的类型系统\r
4. 关注性能优化最佳实践\r
\r
---\r
\r
*希望这篇指南对你学习 Vue 3 有所帮助！如果有任何问题，欢迎在评论区讨论。*\r
`;export{n as default};
