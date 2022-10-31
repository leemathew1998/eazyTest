import { reactive } from "vue";
export const rules = reactive({
  examName: [{ required: true, message: "请输入考试名称", trigger: "blur" }],
  examType: [{ required: true, message: "请输入考试类型", trigger: "blur" }],
  examTime: [{ required: true, message: "请输入考试时长", trigger: "blur" }],
  examTimeRange: [{ required: true, message: "请输入考试时间", trigger: "blur" }],
  examPassScore: [{ required: true, type: "number", message: "请输入及格分数", trigger: "blur" }],
  examCrews: [{ required: true, message: "请选择考试人员", trigger: "blur" }],
});

export const options = [
  {
    label: "组别选择",
    options: [
      {
        value: "应用组",
        label: "应用组",
      },
      {
        value: "存储组",
        label: "存储组",
      },
    ],
  },
  {
    label: "人员选择",
    options: [
      {
        value: "张三",
        label: "张三",
      },
      {
        value: "李四",
        label: "李四",
      },
      {
        value: "王武",
        label: "王武",
      },
    ],
  },
];
