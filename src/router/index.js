import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { useAppStore } from "@/store/modules/app.js";
const userStore = useUserStore(pinia);
const appStore = useAppStore(pinia);
console.log(appStore.remoteRoutes);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    next();
  } else if (userStore.token !== "") {
    // console.log(router.getRoutes());
    next();
  } else {
    next("/login");
  }
});
router.afterEach(() => {});
export default router;
