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
      //阅卷的得分
      reviewScore: [],
      // 负责左侧点击，然后中间进行相应跳转。
      clickItem: {
        type: "",
        number: -1,
      },
      runCodeIndex: -1,
      //trackingjs中检测时间，一分钟没检测到就报警
      trackingTimeRange: 60000,
      //考试时间,以分钟计算
      totalExamTime: 1,
      examId: null,
    };
  },
  actions: {
    MyReset() {
      this.answers = {
        单选: [],
        多选: [],
        判断: [],
        简答: [],
        编程: [],
      };
      this.reviewScore = [];
      this.clickItem = {
        type: "",
        number: -1,
      };
      this.runCodeIndex = -1;
      this.trackingTimeRange = 60000;
      this.totalExamTime = 1;
      this.examId = null;
    },
  },
});
