import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      routes: [],
      remoteRoutes: JSON.parse(localStorage.getItem("remoteRoutes"))?.remoteRoutes | [],
    };
  },
  actions: {
    solveRoutes(payload) {
      this.routes.length && this.routes.find((item) => item.path === payload.path) ? "" : this.routes.push(payload);
    },
    spliceRoutes(payload) {
      this.routes.length && this.routes.splice(payload, 1);
    },
  },
  getters: {
    // 自动将返回类型推断为数字
    returnRoutes(state) {
      return state.routes;
    },
  },
});
