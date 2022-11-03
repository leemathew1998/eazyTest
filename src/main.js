import { createApp } from "vue";
import router from "@/router";
// import { createPinia } from "pinia";
import pinia from '@/store/pinia.js'
import App from "./App.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "./assets/css/tailwind.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
