<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(async () => {
  await nextTick();

  if (typeof window !== 'undefined') {
    const twikoo = await import('twikoo');
    twikoo.init({
      envId: 'https://pingluo.tianmen15.online',
      el: '#tcomment',
    });
  }
});
</script>

<template>
  <div id="tcomment"></div>
</template>
<style>
#tcomment {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
/* 评论背景 */
.tk-comments {
  background-image: url(https://tu.tianmen15qwq.dpdns.org/file/AgACAgUAAyEGAAScvBs8AAMmaJyT8Pi24yrsNcRmGOlJXkaUalkAAs7FMRvuN-lUBbTksLXfi80BAAMCAAN3AAM2BA.png);
  background-size: cover;        /* 背景铺满容器 */
  background-position: center;   /* 居中显示 */
  background-repeat: no-repeat;  /* 不重复 */
  border-radius: 20px;           /* 圆角 */
  padding: 20px;                 /* 内边距，避免文字贴边 */
  color: #fff;                   /* 默认字体颜色白色 */
  position: relative;            /* 为遮罩层做准备 */  
  z-index: 0;     
}

/* 添加一个半透明遮罩层，让文字更清晰 */
.tk-comments::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;  
  background: rgba(0,0,0,0.4);  /* 半透明黑色遮罩 */
  z-index: -20;
}
#tcomment {
  max-width: 880px;
  margin: 28px auto;
  padding: 18px;
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


/* 半透明遮罩，保证文字可读 */
.tk-comments::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6,6,20,0.28), rgba(6,6,20,0.46));
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);
  z-index: -10;
}



/* 提交区卡片微样式 */
.tk-submit {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

/* 头像样式 */
.tk-avatar {
  flex: 0 0 56px;
}
.tk-avatar-img,
.tk-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.14), inset 0 1px 0 rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.06);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
}

/* 输入区（文本域） */
.el-textarea__inner,
.el-input__inner {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #fff;
  padding: 10px 12px;
  font-size: 14px;
  transition: box-shadow .18s ease, transform .12s ease;
  outline: none;
}
.el-textarea__inner::placeholder,
.el-input__inner::placeholder {
  color: rgba(255,255,255,0.6);
}
.el-textarea__inner:focus,
.el-input__inner:focus {
  box-shadow: 0 6px 18px rgba(79,70,229,0.18);
  border-color: rgba(79,70,229,0.9);
  transform: translateY(-1px);
}

/* 标签（昵称/邮箱/网址 前缀） */
.el-input-group__prepend {
  background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
  border-right: 1px solid rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.9);
  padding: 6px 10px;
  border-radius: 8px 0 0 8px;
}

/* 操作按钮区 */
.tk-row.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.tk-submit-action .el-button,
.tk-send {
  border-radius: 999px;
  padding: 6px 16px;
  background: linear-gradient(135deg, #7c5cff, #4f46e5 60%);
  border: none;
  color: #fff;
  box-shadow: 0 6px 20px rgba(79,70,229,0.24);
}
.tk-send.is-disabled {
  opacity: 0.5;
  filter: grayscale(.1);
  cursor: not-allowed;
}

/* OwO 表情区域样式 */
.OwO {
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  padding: 8px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
}
.OwO-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 0;
}
.OwO-item img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform .14s ease;
  cursor: pointer;
}
/* 显示大小 */
.tk-content img{
  min-width: 300px;
}
.OwO-item{
  min-width: 90x;
  min-height: 90px;
}
.OwO .OwO-body .OwO-items-image .OwO-item {
  width: 0;
}
.OwO-item{
  width: 0;
}
.OwO-item {
  min-width: 42px !important;
}
.OwO .OwO-body .OwO-items-image .OwO-item {
  width: 25% !important;
  box-sizing: border-box;
}
.OwO .OwO-body .OwO-items .OwO-item {
  font-size: 42px !important;
}
.OwO .OwO-body .OwO-items-image .OwO-item img {
  max-width: 164%!important;
}
.OwO-item img:hover { transform: translateY(-4px) scale(1.05); }
.OwO-body{
  z-index: 100000000000!important;
}
.el-button span{
  color: #ffd1f7;
}
svg{
  color:#76a1da ;
}
/* 评论列表标题 */
.tk-comments-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 6px;
  margin-top: 6px;
  color: rgba(255,255,255,0.95);
  font-weight: 600;
}

/* 每条评论卡片 */
.tk-comment {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-top: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.03);
  transition: transform .12s ease, box-shadow .12s ease;
}
.tk-comment:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(20,18,28,0.36);
}

/* 评论主体与动作 */
.tk-main {
  flex: 1;
}
.tk-nick {
  color: #ffd1f7; /* 二次元粉色昵称 */
  font-weight: 700;
  letter-spacing: .2px;
}
.tk-tag { margin-left: 8px; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
.tk-tag-green { background: rgba(30,200,120,0.12); color: #b7ffd9; }

/* 时间、设备信息 */
.tk-time, .tk-extra-text {
  color: rgba(255,255,255,0.6);
  font-size: 12px;
}

/* 评论内容 */
.tk-content {
  margin-top: 8px;
  color: #fff;
  line-height: 1.65;
  font-size: 14px;
  word-break: break-word;
}

/* 回复 / 点赞 链接 */
.tk-action-link, .tk-reply {
  color: #a8b4ff;
  font-size: 13px;
}
.tk-action-link:hover, .tk-reply:hover { text-decoration: underline; color: #fff; }

/* footer */
.tk-footer {
  margin-top: 14px;
  text-align: right;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

/* 管理面板/登录弹窗 */
.tk-admin { background: rgba(0,0,0,0.45); border-radius: 12px; padding: 10px; color: #fff; }

/* 响应式 */
@media (max-width: 720px) {
  #tcomment { padding: 12px; }
  .tk-avatar, .tk-avatar-img { width: 48px; height: 48px; }
  .OwO-item img { width: 38px; height: 38px; }
  .tk-comments { padding: 12px; border-radius: 12px; }
}

/* 可选：添加一点轻微漂浮的星星/光点（性能友好） */
.tk-comments::after {
  content: "";
  pointer-events: none;
  position: absolute;
  left: -10%;
  top: -10%;
  width: 120%;
  height: 120%;
  background-image:
    radial-gradient(2px 2px at 10% 20%, rgba(255,255,255,0.06) 0, transparent 60%),
    radial-gradient(1.6px 1.6px at 40% 80%, rgba(255,255,255,0.05) 0, transparent 60%);
  z-index: 0;
  mix-blend-mode: screen;
  opacity: 0.9;
}
</style>