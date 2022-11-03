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
  if(appStore.deleteRoutes.length>0&&router.hasRoute(appStore.deleteRoutes[0])){
    // 代表有路由需要删掉，但是也不能确定是不是已经删过了，在此处判断,需要遍历删掉
    appStore.deleteRoutes.forEach(name=>router.removeRoute(name))
  }
  if (whiteList.includes(to.path)) {
    next();
  } else if (userStore.token !== "") {
    next();
  } else {
    next("/login");
  }
});
router.afterEach(() => {});
export default router;
