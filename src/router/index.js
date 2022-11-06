import { createRouter, createWebHashHistory } from "vue-router";
import { constantsRoutes } from "./router.js";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
import { useAppStore } from "@/store/modules/app.js";
const appStore = useAppStore(pinia);
const userStore = useUserStore(pinia);
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRoutes,
});
router.beforeEach(async (to, from, next) => {
  console.log("router into ", to.path);
  detectRoute();
  next();
  // if (whiteList.includes(to.path)) {
  //   next();
  // } else if (userStore.token) {
  //   next();
  // } else {
  //   next("/login");
  // }
});
router.afterEach(() => {});

const detectRoute = () => {
  // 此处也有问题，只能选择优雅降级方式来对路由进行删除
  //路由需要删掉，但是也不能确定是不是已经删过了，在此处判断,需要遍历删掉
  if (typeof appStore.deleteRoutes === "undefined") {
    const localDeleteRoutes = JSON.parse(localStorage.getItem("deleteRoutes"))?.deleteRoutes;
    if (localDeleteRoutes && localDeleteRoutes.length > 0 && router.hasRoute(localDeleteRoutes[0])) {
      console.log("undefined删除-->", localDeleteRoutes);
      localDeleteRoutes.forEach((name) => router.removeRoute(name));
    }
  } else if (appStore.deleteRoutes.length > 0 && router.hasRoute(appStore.deleteRoutes[0])) {
    // 代表有
    console.log("appStore删除-->", appStore.deleteRoutes);
    appStore.deleteRoutes.forEach((name) => router.removeRoute(name));
  }
};

export default router;
