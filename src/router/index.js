import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./router.js";
// import NProgress from "nprogress";
// import "nprogress/nprogress.css";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store/modules/userInfo.js";
const userStore = useUserStore(pinia);
// NProgress.configure({
//   showSpinner: false,
// });
const whiteList = ["/login", "/404"]; // no redirect whitelist
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // NProgress.start(); // start progress bar
  next();
  // if (whiteList.includes(to.path)) {
  //   next();
  // } else if (userStore.token !== "") {
  //   next();
  // } else {
  //   next("/login");
  // }
});
router.afterEach(() => {
  // NProgress.done(); // finish progress bar
});
export default router;
