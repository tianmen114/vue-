<template>
  <div 
    class="back-to-top" 
    :class="{ 'visible': isVisible }"
    @click="scrollToTop"
  >
    <div class="back-to-top-icon">
      <img src="./5a1b3376ac264e9daf159d205b717a55.jpg" :alt="imageAlt">
    </div>
    <div v-if="showTooltip" class="back-to-top-tooltip">{{ tooltipText }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  threshold?: number
  showTooltip?: boolean
  imageSrc?: string
  imageAlt?: string
  tooltipText?: string
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 300,
  showTooltip: true,
  imageAlt: '回到顶部',
  tooltipText: '回到顶部'
})

const isVisible = ref(false)

const handleScroll = () => {
  const scrollY = window.pageYOffset || document.documentElement.scrollTop
  isVisible.value = scrollY > props.threshold
}

const scrollToTop = () => {
  console.log('BackToTop clicked!')
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  top: 70%;
  right: 10%;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.back-to-top.visible {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(255, 111, 145, 0.3);
}

.back-to-top-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-to-top:hover .back-to-top-icon {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 111, 145, 0.4);
  transition: all 0.3s ease;
}

.back-to-top-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.back-to-top:hover .back-to-top-tooltip {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 768px) {
  .back-to-top {
    top: 75%;
    right: 5%;
  }
  
  .back-to-top-icon {
    width: 45px;
    height: 45px;
  }
  
  .back-to-top-tooltip {
    display: none;
  }
}
</style>
