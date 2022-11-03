import { createRouter, createWebHashHistory } from "vue-router";
import { constantsRoutes } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { useAppStore } from "@/store/modules/app.js";
const appStore = useAppStore(pinia);
const userStore = useUserStore(pinia);
console.log(appStore.remoteRoutes);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRoutes,
});
// JSON.parse(localStorage.getItem("remoteRoutes")).remoteRoutes
router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(to.path)) {
    next();
  } else if (userStore.token !== "") {
    console.log(router.getRoutes());
    next();
    // router.addRoute(asyncRoute[0])
    // next({ ...to, replace: true });
  } else {
    next("/login");
  }
});
router.afterEach(() => {});
export default router;
