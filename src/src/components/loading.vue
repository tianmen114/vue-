<template>
  <div v-if="visible" class="bk">
    <transition name="slide-down">
      <div class="container">
        <div class="background" ref="back">
          <motion.div
            v-motion
            :drag="true"
            :dragConstraints="bounds!"
            :dragElastic="1"
            :dragMomentum="true"
            class="zai"
          >
            <div class="jiazai" ref="bounds">
              <div class="zhe">可拽动</div>
            </div>
          </motion.div>
        </div>
        <div class="right-text">
          <span class="w1" id="w2">正</span>
          <span class="w1" id="w3">在</span>
          <span class="w1" id="w4">加</span>
          <span class="w1" id="w5">载</span>
          <span class="w1" id="w6">中</span>
          <span class="w1" id="w7">请</span>
          <span class="w1" id="w8">稍</span>
          <span class="w1" id="w9">安</span>
          <span class="w1" id="w0">勿</span>
          <span class="w1" id="w10">躁</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { ref, defineProps } from "vue";

const props = defineProps<{ visible: boolean }>();
const bounds = ref(null);
</script>

<style scoped>
.bk{
position: fixed;
width: 100vw; /* 全屏宽度 */
  height: 100vh;
  background-color: rgb(255, 255, 255);
    overflow: hidden; /* 禁止全局滚动 */
}
* {
  margin: 0;
  box-sizing: border-box;
}

.container {
  position: fixed; /* 固定在屏幕 */
  top: 0;
  left: 0;
  width: 100vw; /* 全屏宽度 */
  height: 100vh; /* 全屏高度 */
  display: flex;
  background-color: white;
  z-index: 9999; /* 确保覆盖页面其他内容 */
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 60vw;
  background-image: url(5a1b3376ac264e9daf159d205b717a55.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  animation: w12 6s ease infinite;
}

@keyframes w12 {
  0% {
    transform: translateY(0) scale(1);
    animation-timing-function: ease-out;
  }

  15% {
    transform: translateY(-20px) scale(1.1);
    animation-timing-function: ease-in;
  }

  30% {
    transform: translateY(15px) scale(1.2);
    animation-timing-function: ease-out;
  }

  45% {
    transform: translateY(-10px) scale(1.25);
    animation-timing-function: ease-in;
  }

  60% {
    transform: translateY(5px) scale(1.3);
    animation-timing-function: ease-out;
  }

  75% {
    transform: translateY(-2px) scale(1.25);
    animation-timing-function: ease-in;
  }

  90% {
    transform: translateY(1px) scale(1.1);
    animation-timing-function: ease-out;
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

/* 加载动画 */
.jiazai {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.721);
  border-radius: 50%;
  overflow: hidden;
  animation: myloading 2s 0.5s linear infinite;
}

.jiazai::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to top, transparent, rgb(248, 216, 216));
  border-top-left-radius: 50%;
}

@keyframes myloading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.jiazai:active {
  cursor: grabbing;
}

.zhe {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(241, 170, 162);
  z-index: 100;
  position: absolute;
  background-color: rgb(248, 248, 248);
  width: 240px;
  height: 240px;
  border-radius: 50%;
}

.right-text {
  position: relative;
  flex: 1  0vw;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 5px;
  animation: smoothMove 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.w1 {
  transform: translateY(190px);
  position: relative;
  color: rgb(184, 208, 230);
  font-size: 60px;
  display: inline-block;
  color: rgb(184, 208, 230);
  font-size: 60px;
  animation: mylo 1s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w2 {
  animation: mylo 1s 0.2s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w3 {
  animation: mylo 1s 0.3s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w4 {
  animation: mylo 1s 0.4s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w5 {
  animation: mylo 1s 0.5s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w6 {
  animation: mylo 1s 0.6s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w7 {
  animation: mylo 1s 0.7s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w8 {
  animation: mylo 1s 0.8s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w9 {
  animation: mylo 1s 0.9s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w0 {
  animation: mylo 1s 1s cubic-bezier(0.5, 0, 1, 1) infinite;
}

#w10 {
  animation: mylo 1s 1.1s cubic-bezier(0.5, 0, 1, 1) infinite;
}

@keyframes mylo {
  0% {
    transform: translateY(0);
    font-size: 60px;
  }
  50% {
    transform: translateY(-5px);
    font-size: 64px;
  }
  100% {
    transform: translateY(0);
    font-size: 60px;
  }
}

.zai:hover {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
}
/* vue3动画 */
.slide-down-leave-active {
  transition: all 0.6s ease;
}
.slide-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
