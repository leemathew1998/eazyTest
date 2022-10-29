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
      // 负责左侧点击，然后中间进行相应跳转。
      clickItem: {
        type: "",
        number: -1,
      },
      //trackingjs中检测时间，一分钟没检测到就报警
      trackingTimeRange: 60000,
      //考试时间,以分钟计算
      totalExamTime: 0.5,
    };
  },
});