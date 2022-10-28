import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => {
    return {
      answers: {
        单选: [],
        多选: [],
        判断: [],
        简答: [],
        编程: [],
      },
      clickItem: {
        type: "",
        number: -1,
      },
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
