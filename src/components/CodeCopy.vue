<template>
  <div class="code-block-wrapper">
    <div class="code-header">
      <span class="language-label">{{ language }}</span>
      <button class="copy-button" @click="copyCode" :class="{ 'copied': isCopied }">
        <svg v-if="!isCopied" class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg v-else class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span class="copy-text">{{ isCopied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <div class="code-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  language?: string
  code?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'text',
  code: ''
})

const isCopied = ref(false)

const copyCode = async () => {
  try {
    const codeElement = document.querySelector('.code-content pre code')
    const codeText = codeElement?.textContent || props.code
    
    if (codeText) {
      await navigator.clipboard.writeText(codeText)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('复制失败:', error)
    fallbackCopy()
  }
}

const fallbackCopy = () => {
  const codeElement = document.querySelector('.code-content pre code')
  const codeText = codeElement?.textContent || props.code
  
  if (codeText) {
    const textArea = document.createElement('textarea')
    textArea.value = codeText
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (error) {
      console.error('降级复制失败:', error)
    }
    
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.code-block-wrapper {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.language-label {
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.copy-button.copied {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.copy-icon,
.check-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.copy-text {
  font-size: 0.75rem;
  font-weight: 500;
}

.code-content {
  background: #1f2937;
  color: #f9fafb;
}

.code-content :deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.code-content :deep(code) {
  background: none;
  padding: 0;
  border-radius: 0;
  font-family: inherit;
}

@media (max-width: 768px) {
  .copy-text {
    display: none;
  }
}
</style>
