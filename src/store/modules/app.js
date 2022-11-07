import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      routes: [],
      deleteRoutes: JSON.parse(localStorage.getItem("deleteRoutes"))?.deleteRoutes,
    };
  },
  actions: {
    solveRoutes(payload) {
      this.routes.length && this.routes.find((item) => item.path === payload.path) ? "" : this.routes.push(payload);
    },
    spliceRoutes(payload) {
      this.routes.length && this.routes.splice(payload, 1);
    },
    MyReset() {
      this.routes = [];
      this.deleteRoutes = [];
    },
  },
  getters: {
    // 自动将返回类型推断为数字
    returnRoutes(state) {
      return state.routes;
    },
  },
});
