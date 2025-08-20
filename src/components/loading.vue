<template>
  <transition name="fade">
    <div class="loading-wrapper" v-if="visible">
      <h1 class="loading-text" :class="randomAnimClass">
        <span class="char c1">T</span>
        <span class="char c2">I</span>
        <span class="char c3">A</span>
        <span class="char c4">N</span>
        <span class="char c5">M</span>
        <span class="char c6">E</span>
        <span class="char c7">N</span>
      </h1>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";

const visible = ref(true);
const randomAnimClass = ref("");

// 设置文字随机动画
onMounted(() => {
  const classes = ["floatY", "floatX", "rotateFloat", "wiggle"];
  randomAnimClass.value = classes[Math.floor(Math.random() * classes.length)];

  // 模拟加载完成后淡出
  setTimeout(() => {
    visible.value = false;
  }, 2000);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap");

.loading-wrapper {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #1a0026, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-text {
  font-size: 96px;
  font-family: "ZCOOL KuaiLe", "Comic Sans MS", "Arial Black", cursive, sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.2em;
  display: flex;
  gap: 0.15em;
}

.char {
  color: transparent;
  -webkit-text-stroke: 2px currentColor;
  animation: neonFlicker 1.6s infinite ease-in-out, pulse 2.5s infinite ease-in-out;
  text-shadow: 0 0 6px currentColor, 0 0 12px currentColor, 0 0 24px currentColor,
    0 0 48px currentColor;
  display: inline-block;
}

/* 各字母颜色 */
.c1 {
  color: #ff4dc4;
}
.c2 {
  color: #66ccff;
}
.c3 {
  color: #ffcc00;
}
.c4 {
  color: #c084fc;
}
.c5 {
  color: #00ffcc;
}
.c6 {
  color: #ff6666;
}
.c7 {
  color: #aaffff;
}

/* 闪光 */
@keyframes neonFlicker {
  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 6px currentColor, 0 0 12px currentColor, 0 0 24px currentColor,
      0 0 48px currentColor;
  }
  50% {
    opacity: 0.8;
    text-shadow: 0 0 3px currentColor, 0 0 6px currentColor, 0 0 12px currentColor,
      0 0 24px currentColor;
  }
}

/* 呼吸 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 浮动动效 */
@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
@keyframes floatX {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}
@keyframes rotateFloat {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(2deg) scale(1.04);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}
@keyframes wiggle {
  0% {
    transform: rotate(-1deg);
  }
  50% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(-1deg);
  }
}

.floatY {
  animation: floatY 3s ease-in-out infinite;
}
.floatX {
  animation: floatX 3s ease-in-out infinite;
}
.rotateFloat {
  animation: rotateFloat 3s ease-in-out infinite;
}
.wiggle {
  animation: wiggle 1.6s ease-in-out infinite;
}

/* 淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
