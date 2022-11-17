import { createRouter, createWebHashHistory } from "vue-router";
import { constantsRouters } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { useAppStore } from "@/store/modules/app.js";
import { solveMenuList } from "@/views/login/methods.js";
const userStore = useUserStore(pinia);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRouters,
});
let start = null;
router.beforeEach(async (to, from, next) => {
  document.title = to.name;
  if (whiteList.includes(to.path)) {
    console.log("router into ", to.path, "白名单");
    next();
  } else if (userStore.token) {
    start = new Date().valueOf();
    if (router.getRoutes().length === 5) {
      console.log("router into ", to.path, "添加动态路由");
      await solveMenuList(userStore.routers);
      next();
    } else {
      console.log("router into ", to.path, "token");
      next();
    }
  } else {
    console.log("router into ", to.path, "else");
    next("/login");
  }
});
router.afterEach((to, from, failure) => {
  // console.log("时间", new Date().valueOf() - start, to, from);
});

export default router;
