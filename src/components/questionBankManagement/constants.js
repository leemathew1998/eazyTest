export const basicRules = {
  type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
  level: [
    {
      required: true,
      message: "请选择题目难度",
      trigger: "change",
    },
  ],
  class: [
    {
      required: true,
      message: "请选择知识分类",
      trigger: "change",
    },
  ],
  score: [
    {
      type: "number",
      required: true,
      message: "请输入题目分数",
      trigger: "change",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入题目内容",
      trigger: "change",
    },
  ],
  analysis: [
    {
      // required: true,
      message: "请输入答案分析",
      trigger: "change",
    },
  ],
  checkBoxList: [
    {
      required: true,
      message: "请选择正确答案",
      trigger: "change",
    },
  ],
  radio: [
    {
      required: true,
      message: "请选择正确答案",
      trigger: "change",
    },
  ],
  isTure: [
    {
      required: true,
      message: "请选择正确答案",
      trigger: "change",
    },
  ],
  writeContent: [
    {
      required: true,
      message: "请选择正确答案",
      trigger: "change",
    },
  ],
  optionA: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
  optionB: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
  optionC: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
  optionD: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
  optionE: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
  optionF: [
    {
      required: true,
      message: "请输入选项内容",
      trigger: "change",
    },
  ],
};

export const radioMap = [
  {
    label: "A",
    option: "optionA",
  },
  {
    label: "B",
    option: "optionB",
  },
  {
    label: "C",
    option: "optionC",
  },
  {
    label: "D",
    option: "optionD",
  },
];
export const MultiRadioMap = [
  {
    label: "A",
    option: "optionA",
  },
  {
    label: "B",
    option: "optionB",
  },
  {
    label: "C",
    option: "optionC",
  },
  {
    label: "D",
    option: "optionD",
  },
  {
    label: "E",
    option: "optionE",
  },
  {
    label: "F",
    option: "optionF",
  },
];
