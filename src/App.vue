<template>
  <loading/>
  <motion.div id="scroll-indicator" :style="scrollIndicator" />
  <BackToTop
    :threshold="200"
    :showTooltip="true"
    imageSrc="./components/5a1b3376ac264e9daf159d205b717a55.jpg"
    imageAlt="回到顶部"
    tooltipText="回到顶部"
    class="hover"
  />

  <div id="zhe1" ref="zhe"></div>
  <div
    class="no"
    :style="{ left: x + 'px', top: y + 'px' }"
    ref="mousecss"
    @click="changeImage"
  >
    <img :src="imgsrc" alt="" />
  </div>

  <!-- 图片轮播组件 -->

  <div class="bac1">
    <div class="konzhi1" @mouseenter="startAnimation" ref="konzhi2">
      <div class="ot">
        <div class="rab">
          <span class="option">页</span>
          <span class="option1">面</span>
          <span class="option2">设</span>
          <span class="option3">置</span>
          <div class="x" @click="click"></div>
        </div>
      </div>

      <div class="mouse">
        <span
          >鼠标更换:<span class="yaowan" @click="clickmouse" ref="mouse1"></span>
        </span>

        <span class="zhezhao1">
          <span class="zhezhao">(可能会影响性能qwq)</span>背景遮罩：<span
            class="yaowan"
            id="zhezhao"
            @click="zhezhao"
            ref="zhe2"
          ></span>
        </span>
        <span class="zhezhao2">
          <span class="zhezhao">(可能会影响性能qwq)</span>壁纸模糊度：
          <div class="range-wrap">
            <input class="du" type="range" min="0" max="10" v-model="blur" />
            <div class="bubble"></div></div
        ></span>
        <span class="mouse2"> 壁纸更换:</span
        ><span class="yaowan" id="yaowan" @click="clickmouse2" ref="mouse"></span>
        <div>
          <div class="carousel-container" ref="carouselContainer">
            <div
              class="carousel-wrapper"
              ref="carouselWrapper"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
              @touchstart="startDrag"
              @touchmove="onDrag"
              @touchend="endDrag"
            >
              <div
                class="carousel-track"
                :style="{
                  transform: `translateX(${translateX}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }"
              >
                <div
                  class="carousel-item"
                  v-for="(image, index) in carouselImages"
                  :key="index"
                >
                  <img :src="image.src" :alt="image.alt" @click="selectImage(index)" />
                </div>
              </div>
            </div>
            <div class="carousel-dots">
              <span
                v-for="(image, index) in carouselImages"
                :key="index"
                :class="['dot', { active: currentIndex === index }]"
                @click="goToSlide(index)"
              ></span>
            </div>
            <button class="carousel-btn prev" @click="prevSlide">‹</button>
            <button class="carousel-btn next" @click="nextSlide">›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav
    class="nav"
    ref="nav"
    :class="{ 'nav-hidden': !isNavVisible, 'nav-visible': isAtTop }"
  >
    <ul>
      <span class="tiao">
        <li><RouterLink to="/" ref="t1" class="nav-link">首页</RouterLink></li>
        <li><RouterLink to="/archive" ref="t1" class="nav-link">归档</RouterLink></li>
        <li><RouterLink to="/about" ref="t1" class="nav-link">关于</RouterLink></li>
        <li><RouterLink to="/search" ref="t1" class="nav-link">音乐</RouterLink></li>
        <li><RouterLink to="/picture" ref="t1" class="nav-link">图库</RouterLink></li>
        <li><RouterLink to="/dongman" ref="t1" class="nav-link">追番小屋</RouterLink></li>
      </span>
      <!-- <fangwen class="fanagwen"/> -->
      <!-- 搜索框 -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
          @input="performSearch"
          @focus="showSearchResults = true"
          @blur="hideSearchResults"
        />
        <!-- 搜索结果 -->
        <teleport to="body" id="tel">
          <transition name="search-results" mode="out-in">
            <div v-if="showSearchResults" class="search-results" @mousedown.stop>
              <div v-if="searchResults.length === 0" class="no-results">
                <p>输入关键词开始搜索...</p>
              </div>
              <div
                v-else
                v-for="result in searchResults"
                @mousedown.prevent
                @click.stop="goToArticle(result.id, $event)"
                :key="result.id"
                class="search-result-item"
              >
                <div class="result-title">{{ result.title }}</div>
                <div class="result-description">{{ result.description }}</div>
                <div class="result-tags">
                  <span v-for="tag in result.tags" :key="tag" class="result-tag">{{
                    tag
                  }}</span>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
      </div>
      <button class="beijing" @click="click2" ref="btn">页面设置</button>
    </ul>
  </nav>
  <div class="bzhi" v-if="route.path === '/home'">
    <span>{{ displayText }}</span>
    <div class="scroll-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 3000">
        <path
          fill="currentColor"
          fill-opacity="1"
          fill-rule="nonzero"
          d="M760.890625 1169.878906C746.394531 1155.390625 746.394531 1131.878906 760.890625 1117.390625C775.382812 1102.890625 798.890625 1102.890625 813.386719 1117.390625L1500.03125 1803.921875L2186.609375 1117.328125C2201.109375 1102.839844 2224.621094 1102.839844 2239.109375 1117.328125C2253.609375 1131.828125 2253.609375 1155.328125 2239.109375 1169.828125L1526.28125 1882.671875C1511.78125 1897.160156 1488.269531 1897.160156 1473.78125 1882.671875L760.890625 1169.878906"
        />
      </svg>
    </div>
  </div>
    <div class="jiange"></div>
  <div class="app-container">
    <div class="cover"></div>
    <div class="main-layout">
      <Sidebar />
      <transition name="page" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">

// 移除硬编码的路径引用，使用标准的Vue类型定义
import fangwen from './components/fangwen.vue';
import { ref, type Ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useSpring } from 'motion-v'
import BackToTop from './components/BackToTop.vue';
import { useRouter, useRoute } from 'vue-router';
import { mdFiles, searchMdFiles } from '@/utils/mdLoader';
import Sidebar from './components/Sidebar.vue'
import loading from './components/loading.vue';
// setInterval(() => {
//   console.log("By 😘 tianmen:https://space.bilibili.com/660045843")
// }, 2000)

let konzhi2 = ref<HTMLElement | null>(null);
let mouse = ref<HTMLElement | null>(null);
let mouse1 = ref<HTMLElement | null>(null);
let mousecss = ref<HTMLElement | null>(null);
let imgsrc = ref("./public/irons.png");
let t1 = ref<HTMLElement | null>(null);
let btn = ref<HTMLElement | null>(null);
const bodyElement = ref(document.body)
let zhe = ref<HTMLElement | null>(null);
let zhe2 = ref<HTMLElement | null>(null);
let duliang = ref()
const blur = ref(0)

// 搜索相关
const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showSearchResults = ref(false)
import { motion, useScroll } from "motion-v"
import gg from './src/components/gg.vue';


const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
})
const scrollIndicator = {
  scaleX: scaleX,
  position: 'fixed',
  zIndex: 2147483647, // 最大值，始终在最上层
  top: 0,
  left: 0,
  right: 0,
  height: '10px',
  transformOrigin: '0 0', // 固定动画起点在左上角
  backgroundColor: '#ff6f91b3',
  pointerEvents: 'none' // 避免挡住点击事件
}


// 滚动相关状态
const scrollProgress = ref(0)
const isNavVisible = ref(true)
const isAtTop = ref(true)
const lastScrollTop = ref(0)
const totalWords = ref(0)
const viewCount = ref(0)
watch(blur, () => {
  // 更新背景模糊效果
  updateBackgroundBlur()
})

function updateBackgroundBlur() {
  // 使用CSS变量来控制背景模糊
  if (blur.value > 0) {
    bodyElement.value.style.setProperty('--bg-blur', `${blur.value}px`)
  } else {
    bodyElement.value.style.setProperty('--bg-blur', '0px')
  }
}
// 在组件挂载时添加事件监听器，在卸载时移除以避免内存泄漏
let clickHandler: (() => void) | null = null;

onMounted(() => {
  clickHandler = () => {
    if (imgsrc.value === '/irons.png') {
      imgsrc.value = '/sword.png';
    } else if (imgsrc.value === '/sword.png') {
      imgsrc.value = '/swood.png';
    } else {
      imgsrc.value = '/irons.png';
    }
  };
  window.addEventListener('click', clickHandler);
});

onBeforeUnmount(() => {
  if (clickHandler) {
    window.removeEventListener('click', clickHandler);
  }
});
function clickmouse2() {
  // 获取当前轮播图显示的图片
  const currentImage = carouselImages.value[currentIndex.value]
  // 将当前轮播图的图片设置为背景
  const img = carouselImages.value[4]

  // 切换按钮状态
  if (mouse.value?.className === 'yaowan') {
    bodyElement.value.style.setProperty('--bg-image', `url(${currentImage.src})`)
    mouse.value!.className = 'yaowan1'
  } else if (mouse.value?.className === 'yaowan1') {
    mouse.value!.className = 'yaowan'
    bodyElement.value.style.setProperty('--bg-image', `url(${img.src})`)
  }

  // 更新背景模糊层
  updateBackgroundBlur()
}


function changeImage() {
  if (imgsrc.value == "./public/irons.png") {
    imgsrc.value = "./public/sword.png"
  }
}
function click() {
  konzhi2.value!.className = 'konzhi1'
}
function click2() {
  konzhi2.value!.className = 'konzhi'

}
function clickmouse() {
  if (mouse1.value?.className === 'yaowan') {
    mouse1.value.className = 'yaowan1'
    mousecss.value!.className = 'custom-cursor'
    // 全局隐藏系统光标
    document.documentElement.classList.add('cursor-hidden')
    document.body.style.cursor = 'none'
    btn.value!.style.cursor = 'none'
    t1.value!.style.cursor = 'none'
  } else {
    mouse1.value!.className = 'yaowan'
    mousecss.value!.className = 'no'
    // 还原系统光标
    document.documentElement.classList.remove('cursor-hidden')
    document.body.style.cursor = 'auto'
    btn.value!.style.cursor = 'auto'
    t1.value!.style.cursor = 'auto'
  }
}
const x = ref(0)
const y = ref(0)

// 轮播组件相关
const carouselContainer = ref<HTMLElement | null>(null)
const carouselWrapper = ref<HTMLElement | null>(null)
const translateX = ref(0)
const currentIndex = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
function startAnimation() {
  if (konzhi2.value?.className === "konzhi") {
    setTimeout(() => {
      if (konzhi2.value) {
        konzhi2.value.className = "konzhi2"
        setTimeout(() => {
          if (konzhi2.value) {
            konzhi2.value.className = "konzhi3"
          }
        }, 650)
      }
    }, 0)

  } else if (konzhi2.value?.className === "konzhi3") {
  }
}

function endanimation() {
  if (konzhi2.value) {
    konzhi2.value.className = "konzhi1"
  }
}
// 轮播图片数据
const carouselImages = ref([
  { src: 'https://tu.tianmen15qwq.dpdns.org/file/5d58e79678af42d5e6f70.png', alt: '图片1' },
  { src: 'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMgaJIwuu2BupiAj2KCt9o2R8ZgSrMAAtLCMRv4KpBU7ySvnKnwBCsBAAMCAAN3AAM2BA.png', alt: '图片2' },
  { src: 'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMnaJyT9wKvMrfcWQAB1tCDWhCAL5JuAALPxTEb7jfpVCD_GgQSGLVXAQADAgADdwADNgQ.png', alt: '图片3' },
  { src: 'https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMGaISYKZzqVWeZaNuXflBWCs-ZFSMAAtDDMRsIzChU9AQj0_QoW9YBAAMCAAN3AAM2BA.png', alt: '图片5' }
])

// 轮播功能方法
function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  startX.value = clientX - translateX.value
  currentX.value = clientX
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  currentX.value = clientX
  translateX.value = currentX.value - startX.value
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false

  const itemWidth = carouselContainer.value?.offsetWidth || 400
  const dragDistance = currentX.value - startX.value

  if (Math.abs(dragDistance) > itemWidth * 0.3) {
    if (dragDistance > 0 && currentIndex.value > 0) {
      currentIndex.value--
    } else if (dragDistance < 0 && currentIndex.value < carouselImages.value.length - 1) {
      currentIndex.value++
    }
  }

  updateTranslateX()
}

function updateTranslateX() {
  const itemWidth = carouselContainer.value?.offsetWidth || 400
  translateX.value = -currentIndex.value * itemWidth
}

function nextSlide() {
  if (currentIndex.value < carouselImages.value.length - 1) {
    currentIndex.value++
    updateTranslateX()
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateTranslateX()
  }
}

function goToSlide(index: number) {
  currentIndex.value = index
  updateTranslateX()
}

function selectImage(index: number) {
  currentIndex.value = index
  updateTranslateX()
}

function handleMouseMove(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
}

// 滚动监听函数
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight - windowHeight

  // 计算滚动进度百分比
  scrollProgress.value = Math.round((scrollTop / documentHeight) * 100)

  // 导航栏显示/隐藏逻辑
  if (scrollTop > lastScrollTop.value && scrollTop > 100) {
    // 向下滚动且超过100px时隐藏导航栏
    isNavVisible.value = false
  } else if (scrollTop < lastScrollTop.value || scrollTop <= 100) {
    // 向上滚动或回到顶部时显示导航栏
    isNavVisible.value = true
  }

  // 检查是否在页面顶部
  isAtTop.value = scrollTop <= 10

  lastScrollTop.value = scrollTop
}


function zhezhao() {
  if (zhe2.value?.className === "yaowan") {
    zhe.value!.className = "zhe"
    zhe2.value.className = "yaowan1"
  } else {
    zhe2.value!.className = "yaowan"
    zhe.value!.className = "zhe1"
  }
}

// 搜索相关函数
function performSearch() {
  console.log('搜索关键词:', searchQuery.value)
  if (searchQuery.value.trim()) {
    const results = searchMdFiles(searchQuery.value)
    console.log('搜索结果:', results)
    searchResults.value = results
  } else {
    searchResults.value = []
  }
}

function hideSearchResults() {
  // 延迟隐藏，让用户有时间点击搜索结果
  setTimeout(() => {
    showSearchResults.value = false
  }, 500)
}

function goToArticle(id: string, event?: Event) {
  console.log('跳转到文章:', id)
  console.log('事件对象:', event)

  try {
    router.push(`/article/${id}`)
    searchQuery.value = ''
    searchResults.value = []
    showSearchResults.value = false
  } catch (error) {
    console.error('跳转文章时出错:', error)
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)


})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
//以后在看做不做自定义左键
// document.addEventListener('contextmenu', (event) => {
//   event.preventDefault(); // 阻止默认的右键菜单行为
//   alert('右键被点击了！');
// });
//打字
const texts = ["欢迎来到tianmen的博客 ✨", "记录学习与生活 💻"];
const displayText = ref("");
let index = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = texts[index];

  if (!isDeleting && charIndex < current.length) {
    displayText.value = current.substring(0, charIndex + 1);
    charIndex++;
    setTimeout(type, 100);
  } else if (isDeleting && charIndex > 0) {
    displayText.value = current.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(type, 50);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(type, 1000); // 停顿再删除
    } else {
      isDeleting = false;
      index = (index + 1) % texts.length;
      setTimeout(type, 200);
    }
  }
}

onMounted(() => {
  type();
});
onMounted(() => {
  // 其他现有代码...

  // 新增滚动监听，用于SVG动画效果
  const handleScrollForSVG = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollForSVG);

  // 清理函数
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScrollForSVG);
  });
});

onMounted(() => {
  // 获取SVG元素
  const svgElement = document.querySelector<SVGSVGElement>('.scroll-icon');

  if (svgElement) {
    // 设置初始样式
    svgElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // 滚动处理函数
    const handleSvgScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 当向下滚动超过50px时隐藏SVG
      if (scrollTop > 50) {
        svgElement.style.opacity = '0';
        svgElement.style.transform = 'translateY(20px)';
      } else {
        // 回到顶部区域时显示SVG
        svgElement.style.opacity = '1';
        svgElement.style.transform = 'translateY(0)';
      }
    };

    // 初始执行一次
    handleSvgScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleSvgScroll);

    // 组件卸载时清理
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleSvgScroll);
    });
  }
});
const nav =ref()
const scrollTop =nav.value
function handleScroll1() {
  // 更新当前滚动位置
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop;
  // 记录上次滚动位置
  lastScrollTop.value = scrollTop.value;
}
const navbarClass = computed(() => {
  const classes = [];

  // 滚动超过50px时添加"scrolled"类
  if (nav.value > 50) {
    classes.push('scrolled');
  }

  // 滚动超过300px时添加"deep-scrolled"类
  if (nav.value > 300) {
    classes.push('deep-scrolled');
  }

  // 向下滚动且超过100px时添加"hidden"类
  if (nav.value > lastScrollTop.value && scrollTop.value > 100) {
    classes.push('hidden');
  }

  return classes;
});


// 回到顶部方法
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 挂载时添加事件监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // 初始触发一次，设置初始状态
  handleScroll();
});

// 卸载时移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
<style>
.fanagwen {
  position: absolute;
  top: 120%;
  left: 14%;
}
.hover:hover {
  transform: rotate(360deg);
}
.main-layout {
  display: flex;
  width: 100%;
  min-height: 100vh; /* 为顶部导航栏和公告栏留出空间 */
}

.main-layout > :nth-child(2) {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.range-wrap {
  --accent: #ff6f91;
  --accent2: #9b6fff;
  --track-bg1: #ffd6e7;
  --track-bg2: #c3b3ff;
  width: 340px;
  padding: 28px 10px 14px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

.cursor-hidden,
.cursor-hidden * {
  cursor: none !important;
}

.du[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 50%;
  height: 32px;
  background: transparent;
  outline: none;
}

.du[type="range"]::-webkit-slider-runnable-track {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(var(--accent) 0 0) left / var(--pos, 50%) 100% no-repeat,
    linear-gradient(90deg, var(--track-bg1), var(--track-bg2));
  box-shadow: inset 0 0 0 2px #fff, inset 0 -2px 6px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(255, 111, 145, 0.35);
}

.du[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  margin-top: -9px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffffcc 0 20%, transparent 22%),
    linear-gradient(135deg, var(--accent), var(--accent2));
  border: 3px solid #fff;
  box-shadow: 0 0 12px rgba(255, 111, 145, 0.7), 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.du[type="range"]:hover::-webkit-slider-thumb {
  transform: scale(1.1) rotate(-6deg);
  box-shadow: 0 0 16px rgba(155, 111, 255, 0.8), 0 6px 12px rgba(0, 0, 0, 0.25);
}

.du[type="range"]:active::-webkit-slider-thumb {
  transform: scale(0.95) rotate(6deg);
}

.du[type="range"]::-moz-range-track {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--track-bg1), var(--track-bg2));
  box-shadow: inset 0 0 0 2px #fff, inset 0 -2px 6px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(255, 111, 145, 0.35);
}

.du[type="range"]::-moz-range-progress {
  height: 10px;
  border-radius: 999px;
  background: var(--accent);
}

.du[type="range"]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffffcc 0 20%, transparent 22%),
    linear-gradient(135deg, var(--accent), var(--accent2));
  border: 3px solid #fff;
  box-shadow: 0 0 12px #ff6f91b3, 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.du[type="range"]:focus-visible::-webkit-slider-thumb,
.du[type="range"]:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 6px rgba(255, 111, 145, 0.25), 0 0 16px rgba(155, 111, 255, 0.8),
    0 6px 12px rgba(0, 0, 0, 0.25);
}

.du {
  position: absolute;
  top: -40%;
  left: 65%;
}

#zhe1 {
  transition: all 0.3s ease;
}

.zhe {
  z-index: -1;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

#zhezhao {
  position: absolute;
  left: 90%;
  top: -35%;
}

#zhezhao1 {
  position: absolute;
  left: 90%;
  top: -35%;
}

.zhezhao2 {
  position: absolute;
  right: 10%;
  top: 70%;
}

.zhezhao1 {
  position: absolute;
  right: 27%;
}

.zhezhao {
  position: relative;
  color: #ff4f81;
  font-size: 10px;
}

.mouse2 {
  display: block;
  margin-top: 7%;
}

.no {
  display: none;
}

html,
body {
  font-family: "Microsoft YaHei", sans-serif;
  height: 100%;
  margin: 0;
  background: linear-gradient(
    135deg,
    #ff9a9d00 0%,
    #fecfef00 50%,
    #fecfef00 100%
  ) !important;
  background-attachment: fixed;
}

.custom-cursor {
  pointer-events: none;
  position: fixed;
  width: 80px;
  height: 80px;
  transform: translate(-30, -30);
  z-index: 99999999;
}

.custom-cursor1 {
  opacity: 0;
}

.rab span {
  background: linear-gradient(90deg, #89f7fe, #66a6ff);
  background-size: 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

#yaowan {
  margin-top: 10%;
  margin-left: 106px;
}

.yaowan {
  top: -6px;
  position: absolute;
  display: inline-block;
  width: 105px;
  height: 45px;
  border-radius: 50px;
  margin-left: 20px;
  background: linear-gradient(135deg, #e981a3, #b5fffc);
  color: #ff4f81;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(177, 92, 116, 0.3);
  transition: all 0.3s ease-in-out;
}

.yaowan:hover {
  transform: scale(1.08);
  background: linear-gradient(135deg, #4a90e2, #5eead4);
  box-shadow: 0px 6px 14px rgba(0, 128, 255, 0.5);
  transition: all 0.35s cubic-bezier(0.84, 0.57, 0.28, 1.33);
}

.yaowan::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 4px;
  border-radius: 20px;
  width: 89px;
  height: 37px;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.1s ease-in-out;
}

.yaowan::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 3.7px;
  border-radius: 50%;
  height: 38px;
  width: 38px;
  background-color: #ffffff;
  transition: all 0.3s ease-in-out;
}

/* 激发成功 */
.yaowan1 {
  top: -6px;
  position: absolute;
  display: inline-block;
  width: 105px;
  height: 41px;
  border-radius: 50px;
  margin-left: 20px;
  background: linear-gradient(135deg, #1963bc, #1fc74c);
  color: #ff4f81;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(255, 150, 180, 0.3) 0px 0px 0px 0px;
  transition: all 0.3s ease-in-out;
}

.yaowan1::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 6px;
  border-radius: 20px;
  width: 100px;
  height: 30px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease-in-out;
}

.yaowan1::after {
  content: "";
  transform: scale(1.08);
  position: absolute;
  left: 75px;
  top: 3.7px;
  border-radius: 50%;
  height: 38px;
  width: 38px;
  background-color: #ffffff;
  box-shadow: 11px 0px 20px 5px rgba(56, 56, 56, 0.452);
  transition: all 0.1s ease-in-out;
}

.yaowan1:hover {
  transform: scale(1.08);
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  box-shadow: 0px 6px 14px rgba(255, 150, 180, 0.5);
  transition: all 0.35s cubic-bezier(0.84, 0.57, 0.28, 1.33);
}

.mouse {
  position: relative;
  margin-top: 110px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 20px;
  color: rgb(56, 56, 56);
}

body {
  background: none;
  /* 确保模糊效果不会影响布局 */
  overflow-x: hidden;
  overflow-y: auto;
  /* 使用CSS变量控制背景模糊 */
  --bg-blur: 0px;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(
    --bg-image,
    url("https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMGaISYKZzqVWeZaNuXflBWCs-ZFSMAAtDDMRsIzChU9AQj0_QoW9YBAAMCAAN3AAM2BA.png")
  );
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  filter: blur(var(--bg-blur));
  z-index: -1;
}

@font-face {
  font-family: "MyFont";
  src: url("./components/font/minecraft.ttf") format("woff2");
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 基础导航样式 */
.nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 60px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 60px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.5s ease;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* 隐藏状态 */
.nav-hidden {
  transform: translate(-50%, -120%);
  opacity: 0;
  transition: all 0.6s ease;
}

/* 显示状态 */
.nav-visible {
  transform: translateX(-50%);
  opacity: 1;
  animation: slideFadeIn 0.6s ease forwards;
}

/* 炫酷动画 */
@keyframes slideFadeIn {
  0% {
    transform: translate(-50%, -120%) scale(0.8);
    opacity: 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: translate(-50%, 10%) scale(1.05);
    opacity: 1;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
}

/* 悬停炫光效果 */
.nav:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateX(-50%) scale(1.02);
}

/* 内部元素过渡 */
.nav * {
  transition: all 0.3s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.beijing {
  padding: 0 50px;
  position: absolute;
  right: 20px;
  top: 7px;
  font-size: 20px;
  border: none;
  background: none;
  color: #222;
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
}

.beijing:hover {
  color: #fff;
  border-radius: 40px;
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  transform: scale(1.03);
}

.nav ul {
  display: flex;
  list-style: none;
}

.nav ul {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.nav a {
  text-decoration: none;
  color: #222;
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  display: inline-block;
  cursor: default;
}

.nav li a:hover {
  color: #fff;
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  box-shadow: 0 4px 12px rgba(255, 114, 150, 0.4);
  transform: scale(1.08);
}

.tiao {
  border-radius: 50px;
  left: 16px;
  top: 5px;
  position: absolute;
  border: 5px solid rgba(93, 93, 93, 0.8);
  padding: 0;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: transparent;
  margin: 0;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    height: auto;
  }

  .nav ul {
    flex-direction: column;
    gap: 10px;
  }
}

.bac1 {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.konzhi {
  right: 10%;
  left: 20%;
  z-index: 1999;
  position: fixed;
  top: 1%;
  width: 60px;
  height: 60px;
  min-width: 50%;
  max-width: 60%;
  min-height: 80%;
  max-height: 80%;
  background-image: url(./components/5a1b3376ac264e9daf159d205b717a55.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  align-items: center;
  opacity: 0.95555;
  border-radius: 50px;
  box-shadow: 0px 0px 20px 20px rgba(135, 234, 214, 0.516);
  transform-origin: center;
  transition: all 0.65s cubic-bezier(0, -0.09, 0.28, 1.25);
}

.konzhi2 {
  left: 24%;
  z-index: 1999;
  position: fixed;
  top: -6%;
  min-width: 60%;
  max-width: 60%;
  min-height: 88%;
  max-height: 88%;
  background-image: url(./components/5a1b3376ac264e9daf159d205b717a55.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  align-items: center;
  opacity: 0.95555;
  border-radius: 50px;
  box-shadow: 0px 0px 20px 20px rgba(135, 234, 214, 0.516);
  transform-origin: center;
  transition: all 0.65s cubic-bezier(0, -0.09, 0.28, 1.25);
  box-shadow: -6px 6px 20px 2px rgba(255, 111, 145, 0.516);
  transition: all 0.7s ease;
}

.konzhi3 {
  left: 17%;
  z-index: 1999;
  position: fixed;
  top: 2%;
  min-width: 50%;
  max-width: 60%;
  min-height: 80%;
  max-height: 80%;
  background-image: url(./components/5a1b3376ac264e9daf159d205b717a55.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  align-items: center;
  opacity: 0.95555;
  border-radius: 50px;
  box-shadow: 0px 0px 20px 20px rgba(135, 234, 214, 0.516);
  transform-origin: center;
  transition: all 0.65s cubic-bezier(0, -0.09, 0.28, 1.25);
}

.konzhi1 {
  top: 1%;
  left: 20%;
  z-index: 1999;
  position: fixed;
  width: 60px;
  height: 60px;
  min-width: 50%;
  max-width: 60%;
  min-width: 50%;
  max-height: 80%;
  background-image: url(./components/5a1b3376ac264e9daf159d205b717a55.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  align-items: center;
  border-radius: 50px;
  box-shadow: 0px 0px 20px 20px rgba(135, 234, 214, 0.516);
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.88, -0.32, 0, 1.3);
  transform: translate(500px, 700px);
  opacity: 0;
  backdrop-filter: blur(10px);
  transition: all 1s cubic-bezier(0.19, 1.29, 0.41, 1.78);
}

.konzhi:hover {
  min-width: 63%;
  max-height: 83%;
  top: 0px;
  right: 10%;
  box-shadow: -6px 6px 20px 2px rgba(255, 111, 145, 0.516);
  transition: all 0.9s cubic-bezier(0.19, 1.29, 0.41, 1.78);
}

@keyframes my {
  0% {
    top: 7px;
    background-position: 0% 50%;
  }

  50% {
    top: 25px;
  }

  100% {
    top: 7px;
    background-position: 100% 50%;
  }
}

.option {
  font-family: "MyFont", sans-serif;
  position: absolute;
  display: inline-block;
  left: 3.8%;
  top: 25px;
  font-size: 24px;
  animation: my 1s infinite ease-in-out;
}

.option1 {
  font-family: "MyFont", sans-serif;
  position: absolute;
  display: inline-block;
  left: 7.8%;
  top: 25px;
  font-size: 24px;
  animation: my 1s 0.1s infinite ease-in-out;
}

.option2 {
  font-family: "MyFont", sans-serif;
  position: absolute;
  display: inline-block;
  left: 11.8%;
  top: 25px;
  font-size: 24px;
  animation: my 1s 0.2s infinite ease-in-out;
}

.option3 {
  font-family: "MyFont", sans-serif;
  position: absolute;
  display: inline-block;
  left: 15.8%;
  top: 27px;
  font-size: 22px;
  animation: my 1s 0.3s infinite ease-in-out;
}

.ot {
  position: relative;
}

.x {
  position: absolute;
  top: 7px;
  right: 2.3%;
  width: 40px;
  height: 40px;
  background-image: url("./components/icon/icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  animation: my 2s infinite cubic-bezier(0.25, 0.1, 0.25, 1);
}

.x:hover {
  background-image: url("./components/icon/untitled.svg");
}

/* 轮播组件样式 */
.carousel-container {
  position: absolute;
  top: 280%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  background: rgba(243, 183, 183, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 145, 145, 0.3);
  backdrop-filter: blur(10px);
  z-index: 2000;
  overflow: hidden;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
}

.carousel-wrapper:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  height: 100%;
  width: 100%;
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.carousel-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.carousel-item img:hover {
  transform: scale(1.05);
}

.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.dot.active {
  background: #ff758c;
  transform: scale(1.3);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-container {
    width: 90%;
    height: 250px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}

/* 搜索功能样式 */
.search-container {
  top: 15%;
  right: 15%;
  position: absolute;
  margin: 0 1rem;
  z-index: 100000;
}

.search-input {
  z-index: 100000;
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #333;
  font-size: 0.9rem;
  width: 100px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-input:focus {
  width: 250px;
  outline: none;
  border-color: #ff9a9e;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 154, 158, 0.3);
}

.search-input::placeholder {
  color: rgba(51, 51, 51, 0.7);
}

.search-results {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateY(-20px);
  background: transparent;
  border: none;
  border-radius: 15px;
  backdrop-filter: blur(15px);
  box-shadow: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 999999999;
  width: 90%;
  max-width: 600px;
  margin-top: 0.5rem;
  padding: 0;
}

.search-result-item {
  position: relative;
  z-index: 1000;
  padding: 1.5rem;
  margin: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #666;
  font-style: italic;
}

.result-title {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  line-height: 1.4;
}

.result-description {
  color: #4a5568;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  position: relative;
}

.result-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.result-tag {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

@media (max-width: 768px) {
  .search-input {
    width: 200px;
  }

  .search-results {
    max-height: 300px;
  }

  .search-result-item {
    padding: 1rem;
    margin: 0.5rem;
  }

  .result-title {
    font-size: 1rem;
  }

  .result-description {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .search-results {
    width: 95%;
    max-height: 250px;
  }

  .search-result-item {
    padding: 0.75rem;
    margin: 0.25rem;
    border-radius: 8px;
  }

  .result-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .result-description {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }

  .result-tag {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }
}

/* 搜索结果过渡动画 */
.search-results-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  will-change: opacity, transform;
}

.search-results-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
  will-change: opacity, transform;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-10px);
} /* 路由动画 */
/* 页面淡入淡出动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px); /* 页面从下方滑入 */
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* 页面向上滑出 */
}
.bzhi {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.bzhi span {
  position: absolute;
  top: -25%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-size: 100px;
  z-index: 10;
  color: #435af0;
  position: relative;
  z-index: -1;
}

.scroll-indicator-icon {
  position: fixed; /* 固定位置，不随滚动移动 */
  bottom: 30px; /* 距离底部30px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 水平居中调整 */
  z-index: 1000; /* 确保在其他内容上方 */
  color: #ff6f91; /* 设置SVG颜色，与进度条呼应 */
  opacity: 0.8; /* 稍微透明 */
  transition: all 0.3s ease; /* 平滑过渡效果 */
  pointer-events: none; /* 不干扰鼠标事件 */
}

.scroll-icon {
  position: absolute;
  bottom: 100px;
  left: 45%;
  width: 150px !important;
  height: 150px !important;
  animation: bounce 2s infinite;
}

/* 弹跳动画 */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 当页面滚动时改变样式 */
body.scrolled .scroll-icon {
  opacity: 1;
  transform: translateX(-50%) scale(1.1);
}
.jiange{
  height: 100px;
}
</style>

