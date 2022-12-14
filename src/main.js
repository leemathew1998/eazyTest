import { createApp } from "vue";
import router from "@/router";
import pinia from "@/store/pinia.js";
import App from "./App.vue";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "./assets/css/tailwind.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import setupDirectives from "./diractives";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
//设置指令
setupDirectives(app);
app.use(pinia).use(router).mount("#app");
