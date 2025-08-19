<template>
  <div class="loading-container" :class="{ 'loading-fade': fadeOut }">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <div class="loading-text">{{ loadingText }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  loadingText?: string
}>()

const fadeOut = ref(false)

// 默认加载文本
const loadingText = props.loadingText || '加载中...'

// 添加淡出效果的方法
const startFadeOut = () => {
  fadeOut.value = true
}

// 暴露方法给父组件
defineExpose({
  startFadeOut
})

onMounted(() => {
  // 组件挂载时的逻辑
})

onBeforeUnmount(() => {
  // 组件卸载前的清理工作
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  transition: opacity 0.3s ease;
}

.loading-fade {
  opacity: 0;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
  border-top-color: #ff9a9e;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: #a8edea;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: #d299c2;
}

.spinner-ring:nth-child(4) {
  animation-delay: 0s;
  border-top-color: #fecfef;
}

@keyframes spinner-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>