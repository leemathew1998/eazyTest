import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => {
    return {
      answers: {},
    };
  },
  actions: {},
  getters: {
    // 自动将返回类型推断为数字
    returnAnswers(state) {
      return state.answers;
    },
  },
});
