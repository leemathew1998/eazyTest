import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: JSON.parse(localStorage.getItem("userInfo"))?.username | "",
      password: JSON.parse(localStorage.getItem("userInfo"))?.password | "",
      token: JSON.parse(localStorage.getItem("userInfo"))?.token | "",
    };
  },
  actions: {
    changeName() {
      this.username = "pinia yes!";
    },
  },
});
