const r=`---\r
title: 封面图片演示文章\r
date: 2024-01-15\r
tags: [演示, 封面, 图片]\r
description: 这是一个演示封面图片功能的文章，展示了如何在markdown文件中设置封面图片\r
mdimg: https://tu.tianmen15qwq.dpdns.org/file/4a6d1a19070b86ca08f28.jpg\r
---\r
\r
# 封面图片演示\r
\r
这是一篇演示封面图片功能的文章。\r
\r
## 如何设置封面图片\r
\r
在markdown文件的front matter中添加以下字段之一：\r
\r
\`\`\`yaml\r
mdimg: https://example.com/image.jpg\r
\`\`\`\r
\r
或者\r
\r
\`\`\`yaml\r
cover: https://example.com/image.jpg\r
\`\`\`\r
\r
## 功能特点\r
\r
- 支持网络图片链接\r
- 自动适应卡片尺寸\r
- 鼠标悬停时有缩放效果\r
- 文章详情页有3D跟随效果\r
\r
## 代码示例\r
\r
\`\`\`javascript\r
// 在mdLoader.ts中解析封面图片\r
case 'mdimg':\r
case 'cover':\r
  metadata.cover = value\r
  break\r
\`\`\`\r
\r
## 标签功能\r
\r
点击下面的标签可以筛选相同标签的文章：\r
\r
- 演示\r
- 封面  \r
- 图片\r
- 功能\r
\r
## 总结\r
\r
封面图片功能让博客更加美观，每篇文章都可以有独特的视觉标识。\r
`;export{r as default};
