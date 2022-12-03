import { createRouter, createWebHashHistory } from "vue-router";
import { constantsRouters } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { solveMenuList } from "@/views/login/methods.js";
const userStore = useUserStore(pinia);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRouters,
});
router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (whiteList.includes(to.path)) {
    // console.log("router into ", to.path, "白名单");
    next();
  } else if (userStore.token) {
    if (router.getRoutes().length === 2) {
      // console.log("router into ", from.path, "---->", to.path, "添加动态路由");
      solveMenuList(userStore.routers, to.path);
    } else {
      // console.log("router into ", from.path, "---->", to.path, "token");
      next();
    }
  } else {
    // console.log("router into ", to.path, "else");
    next("/login");
  }
});
router.afterEach((to, from, failure) => {
  // console.log("to", to.path, "from", from.path, router.getRoutes());
});

export default router;
