import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { MotionPlugin } from "@vueuse/motion";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: "./", // 添加这一行，使用相对路径
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ['**/*.md'], // 包含 Markdown 文件
});
