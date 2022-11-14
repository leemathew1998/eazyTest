import { createRouter, createWebHashHistory } from "vue-router";
import { constantsRouters } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { useAppStore } from "@/store/modules/app.js";
import { solveMenuList } from "@/views/login/methods.js";
const appStore = useAppStore(pinia);
const userStore = useUserStore(pinia);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRouters,
});
router.beforeEach(async (to, from, next) => {
  document.title = to.name;
  if (whiteList.includes(to.path)) {
    console.log("router into ", to.path, "白名单");
    next();
  } else if (userStore.token) {
    if (router.getRoutes().length === 5) {
      await solveMenuList(userStore.routers);
      next(to.path);
    } else {
      console.log("router into ", to.path, "token");
      next();
    }
  } else {
    console.log("router into ", to.path, "else");
    next("/login");
    // next("/404");
  }
});
router.afterEach(() => {});

export default router;
