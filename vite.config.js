import { defineConfig } from "vite";
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import * as fs from "fs";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({
      emitFile: true, //是否被触摸
      filename: "test.html", //生成分析网页文件名
      open: true, //在默认用户代理中打开生成的文件
      gzipSize: true, //从源代码中收集 gzip 大小并将其显示在图表中
      brotliSize: true, //从源代码中收集 brotli 大小并将其显示在图表中
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import './src/assets/css/common.less';`,
      },
    },
  },
  server: {
    // port: 8080,
    // https: {
    //   open: true,
    //   // 主要是下面两行的配置文件，不要忘记引入 fs 和 path 两个对象
    //   // cert: fs.readFileSync(path.join(__dirname, "src/ssl/cert.crt")),
    //   // key: fs.readFileSync(path.join(__dirname, "src/ssl/cert.key")),
    //   key: fs.readFileSync(path.join(__dirname, "ssl/privatekey.pem")), // 证书文件的存放目录
    //   cert: fs.readFileSync(path.join(__dirname, "ssl/certificate.pem")),
    // },
    proxy: {
      "/api": {
        // target: "http://10.168.4.233:20221",
        target: "http://localhost:20221",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "/api": "/api",
        },
        // https: true,
      },
    },
  },
});
