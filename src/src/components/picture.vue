<template>
  <div class="about-page">
    <div class="container">
      <h1>tianmen图库</h1>
      <div class="image-list">
      <div class="content" v-for="(picture, index) in pic" :key="index">
        <img v-lazy="picture"  class="img"/></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pic = ref([
  'https://tu.tianmen15qwq.dpdns.org/file/4a6d1a19070b86ca08f28.jpg',
  'https://tu.tianmen15qwq.dpdns.org/file/5d58e79678af42d5e6f70.png',
  'https://tu.tianmen15qwq.dpdns.org/file/68f24d9de432bd28ab6eb.jpg',
  'https://tu.tianmen15qwq.dpdns.org/file/7f71ba4ccf956e7a29c95.png',
  'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMgaJIwuu2BupiAj2KCt9o2R8ZgSrMAAtLCMRv4KpBU7ySvnKnwBCsBAAMCAAN3AAM2BA.png',
  'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMGaISYKZzqVWeZaNuXflBWCs-ZFSMAAtDDMRsIzChU9AQj0_QoW9YBAAMCAAN3AAM2BA.png',
  'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMnaJyT9wKvMrfcWQAB1tCDWhCAL5JuAALPxTEb7jfpVCD_GgQSGLVXAQADAgADdwADNgQ.png',
  'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMraKGVE8u3zGYuVMlWJfgOT9ubQ6UAArrGMRsp-ghVaBmaIh1cbV0BAAMCAAN3AAM2BA.png',
]);
</script>


<style scoped>
.about-page {
  padding: 1rem;
  min-width: 800px;
  max-width: 800px;
  margin: 16px 100px;
}

.container {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.241) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(255, 154, 158, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.content {
  margin-bottom: 2rem;
}
.img{
  display: inline-block;
  margin: 10px;
  height: 200px;
  width: auto;
}
.image-list {
  display: flex;
  flex-wrap: wrap;  
  gap: 10px;
}
.image-list img {
  width: 300px;
  height: auto;
  border-radius: 8px;
}

</style>
