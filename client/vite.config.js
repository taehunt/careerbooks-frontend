/* eslint-disable no-undef */
// client/vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd()); // 환경 변수는 로딩만 해주면 됨

  return {
    plugins: [react()],
    base: "/",
    server: {
      proxy: {
        "/api": "http://localhost:5000",
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
