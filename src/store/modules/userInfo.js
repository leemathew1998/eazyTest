import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: JSON.parse(localStorage.getItem("userInfo"))?.username | "",
      password: JSON.parse(localStorage.getItem("userInfo"))?.password | "",
      // token: JSON.parse(localStorage.getItem("userInfo"))?.token | "",
      token:
        "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2Njc0NTc5MTMsInN1YiI6ImFkbWluIiwiaWF0IjoxNjY3NDM5OTEzNTI1fQ.h1NYVv3R7VqqytNGg2bii6Sao6lVdI9qeF36LlX0MVUi4Yz-wAMDpdEtqm55GDwwpNVq97Np_YkPJ8P52tCWEQ",
    };
  },
  actions: {
    changeName() {
      this.username = "pinia yes!";
    },
  },
});
