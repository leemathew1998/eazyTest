import { reactive } from "vue";
const validateSliderCount = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error("请选择题量"));
  } else {
    callback();
  }
};
const validateSliderLevel = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error("请选择难度系数"));
  } else {
    callback();
  }
};
const validateSliderTotalScore = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error("请输入试卷总分"));
  } else {
    callback();
  }
};
export const rules = reactive({
  examName: [{ required: true, message: "请输入试卷名称", trigger: "blur" }],
  count: [
    { required: true, message: "请选择题量", trigger: "blur" },
    { validator: validateSliderCount, trigger: "blur" },
  ],
  level: [
    { required: true, message: "请选择难度系数", trigger: "blur" },
    { validator: validateSliderLevel, trigger: "blur" },
  ],
  totalScore: [
    { required: true, message: "请输入试卷总分", trigger: "blur" },
    { validator: validateSliderTotalScore, trigger: "blur" }
  ],
  quesTypes: [{ required: true, message: "请选择题型", trigger: "blur" }],
  class: [{ required: true, message: "请选择知识分类", trigger: "blur" }],
});
