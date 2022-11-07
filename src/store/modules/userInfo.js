import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: JSON.parse(localStorage.getItem("userInfo"))?.username,
      password: JSON.parse(localStorage.getItem("userInfo"))?.password,
      token: JSON.parse(localStorage.getItem("userInfo"))?.token,
      userId: JSON.parse(localStorage.getItem("userInfo"))?.userId,
      roleId: JSON.parse(localStorage.getItem("userInfo"))?.roleId,
      menuLicenses: JSON.parse(localStorage.getItem("userInfo"))?.menuLicenses,
    };
  },
  actions: {
    changeName() {
      this.username = "pinia yes!";
    },
    MyReset() {
      this.username = undefined;
      this.password = undefined;
      this.token = undefined;
      this.userId = undefined;
      this.roleId = undefined;
      this.menuLicenses = [];
    },
  },
});
