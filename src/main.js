import { createApp } from "vue";
import router from "@/router";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./tailwind.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(createPinia()).use(ElementPlus).mount("#app");
