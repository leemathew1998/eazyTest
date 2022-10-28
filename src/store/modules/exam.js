import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => {
    return {
      answers: {
        "单选": [],
        "多选": [],
        "简答": [],
        "判断": [],
        "编程": [],
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
