<template>
  <div class="about-page">
    <div class="container">
      <h1>关于我</h1>
      <div class="content">
        <p>欢迎来到我的个人网站！</p>
        <p>这里是我分享技术、生活和想法的地方。</p><p>项目:</p>
        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=tianmen114&layout=compact" alt="">
      </div>

      <!-- 友链板块 -->
      <div class="friends-section">
        <h2>友情链接</h2>
        <div class="friends-grid">
          <a href="https://github.com" target="_blank" class="friend-card">
            <div class="friend-content">
              <h3></h3>
              <p></p>
            </div>
          </a>
          <a href="https://stackoverflow.com" target="_blank" class="friend-card">
            <div class="friend-content">
              <h3></h3>
              <p></p>
            </div>
          </a>
          <a href="" target="_blank" class="friend-card">
            <div class="friend-content">
              <h3></h3>
              <p></p>
            </div>
          </a>
          <a href="" target="_blank" class="friend-card">
            <div class="friend-content">
              <h3></h3>
              <p></p>
            </div>
          </a>
        </div>
      </div>
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面逻辑
</script>

<style scoped>
.about-page {
  padding: 1rem;
  min-width: 900px;
  max-width: 900px;
  margin: 16px 30px;
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

.content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.back-link:hover {
  background: #2563eb;
}

/* 文章链接样式 */
.articles-section {
  margin: 2rem 0;
}

.articles-section h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.articles-list {
  list-style: none;
  padding: 0;
}

.articles-list li {
  margin-bottom: 0.5rem;
}

.articles-list a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.articles-list a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 友链板块样式 */
.friends-section {
  margin: 2rem 0;
}

.friends-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.friend-card {
  display: block;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.friend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.9);
}

.friend-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.friend-content p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-page {
    min-width: auto;
    max-width: 100%;
    margin: 16px;
  }

  .container {
    padding: 1.5rem;
  }

  .friends-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .friend-card {
    padding: 1rem;
  }
}
</style>
