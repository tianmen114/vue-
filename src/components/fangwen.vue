<!-- src/components/VisitCounter.vue -->
<template>
  <div class="visit-counter">
    <p>本站访问量：<span id="busuanzi_value_site_pv">0</span></p>
    <p>本站访客数：<span id="busuanzi_value_site_uv">0</span></p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.visit-counter {
  color: #666;
}
.visit-counter p{
    display: inline;
    font-size: 20px;
    font-weight: 20px;
    color: #fff;
    text-shadow:
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 15px #fff,
      0 0 20px #ff00de,
      0 0 35px #ff00de;
    background: linear-gradient(90deg, #ff00de, #00ffff, #ff00de, #00ff00, #ffff00);
    background-size: 300% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
    position: relative;
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 300% 50%;
  }
}
</style>
