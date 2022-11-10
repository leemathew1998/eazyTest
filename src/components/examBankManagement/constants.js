import { reactive } from "vue";
export const rules = reactive({
  examName: [{ required: true, message: "请输入考试名称", trigger: "blur" }],
  examType: [{ required: true, message: "请输入考试类型", trigger: "blur" }],
  examTime: [{ required: true, message: "请输入考试时长", trigger: "blur" }],
  examTimeRange: [{ required: true, message: "请输入考试时间", trigger: "blur" }],
  examPassScore: [
    { required: true, message: "请输入及格分数", trigger: "blur" },
    { type: "number", message: "请输入数字", trigger: "blur" },
  ],
  examCrews: [{ required: true, message: "请选择考试人员", trigger: "blur" }],
});

export const mapEnToCN = {
  1: "单选",
  2: "多选",
  3: "判断",
  4: "简答",
  5: "编程",
};
