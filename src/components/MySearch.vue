<template>
  <div class="page" v-show="isShow">
    <div class="glass">
      <div :class="isSearchActive ? 'search1' : 'search'">
        <h1 id="h1">Bytianmen</h1>
        <div class="biaodan">
          <div class="form">
            <label for="type">类型</label>
            <select id="type" v-model="searchType">
              <option value="playlist">歌单</option>
              <option value="song">歌曲</option>
            </select>
          </div>

          <div v-show="searchType === 'playlist'">
            <div class="form-group" id="playlist-group">
              <label for="playlist">歌单ID</label>
              <input type="text" id="playlist" placeholder="歌单ID，例如：6821530729" />
            </div>
          </div>

          <div class="form-group">
            <label for="search-input">搜索关键词</label>
            <div id="shuru" style="display: flex; align-items: center">
              <input
              @keydown="add"
                v-model="keywords"
                type="text"
                id="search-input"
                placeholder="输入歌曲或歌单名称"
                style="flex: 1"
              />
              <button id="search-btn" style="margin-left: 10px" @click="add">搜索</button>
            </div>
          </div>
        </div>

        <div v-for="(wangyi, i) in source" :key="wangyi.id || i" class="biaodan1">
          <div id="zhezhao"></div>
          <button class="btn" @click="prev(i)">
            <svg
              id="prev"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24px"
              width="24px"
            >
              <path
                clip-rule="evenodd"
                d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 0 1 0 0-2.4h-4.303l1.551-1.552Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
          <button class="btn" @click="togglePlay(i)">
            <svg
              id="playpause"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24px"
              width="24px"
            >
              <path
                id="playpause-icon"
                clip-rule="evenodd"
                d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 0 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
          <button class="btn" @click="next(i)">
            <svg
              id="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24px"
              width="24px"
            >
              <path
                clip-rule="evenodd"
                d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 0 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </button>
          <img
            id="imgxiao"
            :src="wangyi.picUrl || wangyi.coverImgUrl || '默认图片路径.jpg'"
          />
          <img
            id="img"
            :src="wangyi.picUrl || wangyi.coverImgUrl || '默认图片路径.jpg'"
          />
          <p id="p">{{ wangyi.name || wangyi.creator?.nickname || "未知作者" }}</p>
          <p id="geci" ref="geciRef">{{ wangyi.artist || "未知歌名" }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 隐藏的音频播放器 -->
  <audio
    ref="audioRef"
    :src="currentSrc"
    preload="none"
    style="
      position: absolute;
      left: -10000px;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    "
  ></audio>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";

const audioRef = ref(null);
const keywords = ref("");
const source = ref([]);
const isShow = ref(false);
const searchType = ref("playlist");
const limit = ref(30);
const offset = ref(0);
const currentIndex = ref(-1);
const isPlaying = ref(false);
const geciRef = ref(null);
const API_ROOT = "https://163api.qijieya.cn";
const isSearchActive = ref(false); 

function checkGeciOverflow() {
  const el = geciRef.value;
  if (!el) return;
  const overflow = el.scrollWidth > el.offsetWidth;
  el.classList[overflow ? "add" : "remove"]("scroll");
}

watch(currentIndex, async () => {
  await nextTick();
  checkGeciOverflow();
});

async function fetchWithRetry(url, options = {}, retries = 2, backoff = 300) {
  try {
    const res = await fetch(url, { method: "GET", ...options });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

async function add() {
  isSearchActive.value = true;
  const k = keywords.value.trim();
  if (!k) {
    source.value = [];
    return;
  }

  const type = searchType.value === "playlist" ? 1000 : 1;
  const url = `${API_ROOT}/cloudsearch?keywords=${encodeURIComponent(
    k
  )}&type=${type}&limit=${limit.value}&offset=${offset.value}&timestamp=${Date.now()}`;

  try {
    const data = await fetchWithRetry(url);
    const res = data?.result || {};
    let list = type === 1000 ? res.playlists || [] : res.songs || [];

    if (type === 1) {
      // 补充歌曲 url，图片，艺人名
      list = await Promise.all(
        list.map(async (s) => {
          try {
            const meta = await fetchWithRetry(
              `https://163api.qijieya.cn/song/url/v1?id=${s.id}&level=jymaster`
            );
            s.url = meta.data && meta.data[0] ? meta.data[0].url : "";

            // 图片和艺人信息
            s.picUrl = s.al?.picUrl || "";
            s.artist = s.ar?.map((a) => a.name).join("/") || "";
          } catch {
            s.url = "";
            s.picUrl = s.al?.picUrl || "";
            s.artist = s.ar?.map((a) => a.name).join("/") || "";
          }
          return s;
        })
      );
    }

    source.value = list;
  } catch (err) {
    console.error(err);
    source.value = [];
  }
}

// 核心播放函数：先更新 UI，再设置音频地址播放
async function playAt(index) {
  if (!source.value[index]) {
    console.error("播放失败，索引无效");
    return;
  }
  currentIndex.value = index;

  const item = source.value[index];
  const titleEl = document.getElementById("h1");
  const artistEl = document.querySelector("#p");
  const imgEl = document.querySelector("#img") || document.querySelector("#imgxiao");
  const cardEl = document.querySelector(".search");

  if (titleEl) titleEl.innerText = item.name || titleEl.innerText;
  if (artistEl) artistEl.innerText = item.artist || artistEl.innerText || "";
  if (imgEl && item.picUrl) imgEl.src = item.picUrl;
  if (cardEl && item.picUrl) cardEl.style.backgroundImage = `url(${item.picUrl})`;

  // 用新接口请求播放链接
  try {
    const meta = await fetchWithRetry(
      `https://163api.qijieya.cn/song/url/v1?id=${item.id}&level=jymaster`
    );
    const url = meta.data && meta.data[0] ? meta.data[0].url : null;
    if (!url) {
      console.error("未获取到播放地址");
      return;
    }

    if (audioRef.value) {
      audioRef.value.src = url;
      await audioRef.value.play();
      isPlaying.value = true;
    }
  } catch (e) {
    console.error("播放失败", e);
    isPlaying.value = false;
  }
}

async function togglePlay(index) {
  if (typeof index === "number" && index !== currentIndex.value) {
    await playAt(index);
    return;
  }
  const audio = audioRef.value;
  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();
      isPlaying.value = true;
    } catch {
      isPlaying.value = false;
    }
  } else {
    audio.pause();
    isPlaying.value = false;
  }
}

function prev(index) {
  const len = source.value.length;
  if (!len) return;
  const i =
    typeof index === "number"
      ? (index - 1 + len) % len
      : (currentIndex.value - 1 + len) % len;
  playAt(i);
}

function next(index) {
  const len = source.value.length;
  if (!len) return;
  const i =
    typeof index === "number" ? (index + 1) % len : (currentIndex.value + 1) % len;
  playAt(i);
}

onMounted(() => {
  isShow.value = true;
  if (audioRef.value) {
    audioRef.value.addEventListener("ended", () => {
      next();
    });
  }
});
</script>

<style scoped>
.btn {
  background-color: #ffffff54;
  width: 30px;
  height: 30px;
  position: relative;
  left: 335px;
  bottom: -15px;
  z-index: 99999;
  border: none;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background: linear-gradient(135deg, #208cff, #47a0ff);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #005fb8, #208cff);
}

.left {
  position: absolute;
  z-index: 9999;
  height: 100px;
  width: 100px;
}

#imgxiao {
  background-repeat: repeat;
  background-size: auto;
  top: 0px;
  z-index: 9999;
  position: absolute;
  left: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

#h1 {
  position: relative;
  font-family: "CustomFont", sans-serif;
  display: flex;
  text-align: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  color: #c9d8ea;
}

h1::after {
  z-index: -19;
  position: absolute;
  content: "";
  background: linear-gradient(135deg, #88c3f0, #efe8d7);
  /* 渐变背景 */
  width: 200px;
  height: 40px;
  border-radius: 100px;
  border: 5px;
}

@font-face {
  font-family: "CustomFont";
  src: url("src/components/roe.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.glass {
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search.expand {
  height: 99%;
  margin-top: 100px;
  transition: all 1s ease-in-out;
}

.search {
  border-radius: 80px;
  border: 5px;
  width: 80%;
  height: 200%;
  background-color: #f8f0e371;
  backdrop-filter: blur(10px);
  box-shadow: -20px 10px 12px rgba(238, 179, 179, 0.234),
    20px 8px 20px 11px rgba(0, 0, 0, 0.1);
  margin-top: 350px;
  transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.search1{
  border-radius: 80px;
  border: 5px;
  width: 60%;
  height: 100%;
  background-color: #f8f0e371;
  backdrop-filter: blur(10px);
  box-shadow: -20px 10px 12px rgba(238, 179, 179, 0.234),
    20px 8px 20px 11px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
    transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.biaodan {
  position: relative;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
  border-radius: 50px;
  border: 5px;
}

#zhezhao {
  transform: scale(1);
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  width: 1200px;
  height: 120px;
  backdrop-filter: blur(6px);
  background-color: rgba(50, 50, 50, 0.6);
}

#img {
  z-index: 0;
  top: -60px;
  position: absolute;
  background-image: url("./5d58e79678af42d5e6f70.png");
  background-repeat: repeat;
  background-size: auto;
  width: 100%;
  height: 250px;
}

.biaodan1 {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  height: 80px;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 50px;
  border: 5px;
  overflow: hidden;
}

#p,
#geci {
  position: absolute;
  z-index: 99;
  left: 90px;
  color: #ffffff;
}

#p {
  top: 10px;
  left: 90px;
  font-size: larger;
  font-weight: bold;
}

#geci {
  top: 40px;
  white-space: nowrap;
  overflow: hidden;
}

#geci.scroll {
  animation: geciScroll 8s linear infinite;
}

@keyframes geciScroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0px;
  border: 5px solid rgba(148, 148, 148, 0.164);
  border-radius: 20px;
  box-sizing: border-box;
}

.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
}

#search-btn {
  padding: 10px 15px;
  background-color: #208cff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#search-btn:hover {
  background-color: #47a0ff;
}

.flex-container {
  display: flex;
  align-items: center;
}

.flex-container input[type="text"] {
  flex: 1;
}

.flex-container button {
  margin-left: 10px;
}

img {
  max-width: 100%;
  margin-top: 10px;
}

.page {
  animation: ex 0.6s ease;
  min-height: 100vh;
  min-width: 1000px;
}

@keyframes ex {
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
