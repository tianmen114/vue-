---
title: Vue 3 完全指南 - 从入门到精通
date: 2024-01-20T09:00:00
tags: Vue, 前端, 教程
description: 深入浅出 Vue 3，从基础概念到高级特性，带你掌握现代前端开发。
---

# Vue 3 完全指南 - 从入门到精通

Vue 3 是 Vue.js 的最新主要版本，带来了许多激动人心的新特性和改进。本文将带你深入了解 Vue 3 的核心概念和最佳实践。

## Vue 3 的新特性

### 1. Composition API

Composition API 是 Vue 3 最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑：

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式数据
const count = ref(0)
const title = ref('Vue 3 示例')

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}
</script>
```

### 2. 更好的 TypeScript 支持

Vue 3 使用 TypeScript 重写，提供了更好的类型推断：

```typescript
interface User {
  id: number
  name: string
  email: string
}

const user = ref<User>({
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com'
})
```

### 3. 性能提升

Vue 3 在性能方面有显著提升：

- **更小的包体积**: 通过 tree-shaking 优化
- **更快的渲染**: 新的虚拟 DOM 实现
- **更好的内存使用**: 更高效的响应式系统

## 响应式系统

Vue 3 的响应式系统基于 ES6 的 Proxy，提供了更好的性能和功能：

```javascript
import { reactive, ref, computed, watch } from 'vue'

// 对象响应式
const state = reactive({
  count: 0,
  name: 'Vue 3'
})

// 基本类型响应式
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 监听器
watch(count, (newValue, oldValue) => {
  console.log(`计数从 ${oldValue} 变为 ${newValue}`)
})
```

## 生命周期钩子

在 Composition API 中，生命周期钩子以 `on` 开头：

```javascript
import { onMounted, onUnmounted, onUpdated } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})

onUpdated(() => {
  console.log('组件已更新')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
```

## 最佳实践

### 1. 使用 `<script setup>`

`<script setup>` 是 Vue 3 推荐的语法糖：

```vue
<script setup>
// 导入的组件自动注册
import MyComponent from './MyComponent.vue'

// 顶层的变量和函数自动暴露给模板
const message = 'Hello Vue 3!'
const handleClick = () => {
  console.log('点击了按钮')
}
</script>
```

### 2. 组合式函数 (Composables)

将可复用的逻辑提取为组合式函数：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const double = computed(() => count.value * 2)
  
  return {
    count,
    increment,
    decrement,
    double
  }
}
```

### 3. 类型安全

充分利用 TypeScript 的类型系统：

```typescript
// 定义 Props 类型
interface Props {
  title: string
  count?: number
}

// 定义 Emits 类型
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete'): void
}

// 使用 defineProps 和 defineEmits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
```

## 迁移指南

如果你正在从 Vue 2 迁移到 Vue 3，以下是一些关键点：

### 1. 全局 API 变化

```javascript
// Vue 2
Vue.use(router)
Vue.component('MyComponent', MyComponent)

// Vue 3
import { createApp } from 'vue'
const app = createApp(App)
app.use(router)
app.component('MyComponent', MyComponent)
```

### 2. 事件系统

```javascript
// Vue 2
this.$emit('update', value)

// Vue 3
const emit = defineEmits(['update'])
emit('update', value)
```

### 3. 过滤器移除

Vue 3 移除了过滤器，建议使用计算属性或方法：

```javascript
// Vue 2
{{ message | capitalize }}

// Vue 3
{{ capitalize(message) }}
```

## 总结

Vue 3 带来了许多激动人心的新特性，使开发体验更加流畅和高效。通过掌握 Composition API、TypeScript 支持和性能优化，你可以构建更强大、更可维护的应用程序。

记住，学习 Vue 3 是一个渐进的过程，建议：

1. 先熟悉 Composition API 的基本概念
2. 逐步迁移现有项目
3. 充分利用 TypeScript 的类型系统
4. 关注性能优化最佳实践

---

*希望这篇指南对你学习 Vue 3 有所帮助！如果有任何问题，欢迎在评论区讨论。*
