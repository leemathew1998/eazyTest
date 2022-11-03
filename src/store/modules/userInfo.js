import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: JSON.parse(localStorage.getItem("userInfo"))?.username | "",
      password: JSON.parse(localStorage.getItem("userInfo"))?.password | "",
      // token: JSON.parse(localStorage.getItem("userInfo"))?.token | "",
      token:
        "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2Njc0NzYyMDksInN1YiI6ImFkbWluIiwiaWF0IjoxNjY3NDU4MjA5MDY4fQ.OpNCUJmFoDrncpzscHP1tEc9eZmVleol2A0l4-0t87yzDTTTh7eWqCguMc4y5xCjCBdMG2pSxU9xmV0u7Z1Zzg",
    };
  },
  actions: {
    changeName() {
      this.username = "pinia yes!";
    },
  },
});
