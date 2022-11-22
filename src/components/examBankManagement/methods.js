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
  level: [
    { required: true, message: "请选择难度系数", trigger: "blur" },
    { validator: validateSliderLevel, trigger: "blur" },
  ],
  totalScore: [
    { required: true, message: "请输入试卷总分", trigger: "blur" },
    { validator: validateSliderTotalScore, trigger: "blur" },
  ],
  quesTypes: [{ required: true, message: "请选择题型", trigger: "blur" }],
  class: [{ required: true, message: "请选择知识分类", trigger: "blur" }],
  count1: [{ required: true, message: "请输入单选题题量", trigger: "blur" }],
  count2: [{ required: true, message: "请输入多选题题量", trigger: "blur" }],
  count3: [{ required: true, message: "请输入判断题题量", trigger: "blur" }],
  count4: [{ required: true, message: "请输入简答题题量", trigger: "blur" }],
  count5: [{ required: true, message: "请输入编程题题量", trigger: "blur" }],
});
export const sortMethod0 = (a, b) => {
  return Number(b.userNum) - Number(a.userNum);
};
export const sortMethod1 = (a, b) => {
  return Number(b.singleTnum) - Number(a.singleTnum);
};
export const sortMethod2 = (a, b) => {
  return Number(b.moreTnum) - Number(a.moreTnum);
};
export const sortMethod3 = (a, b) => {
  return Number(b.judgeTnum) - Number(a.judgeTnum);
};
export const sortMethod4 = (a, b) => {
  return Number(b.ansTnum) - Number(a.ansTnum);
};
export const sortMethod5 = (a, b) => {
  return Number(b.programTnum) - Number(a.programTnum);
};
