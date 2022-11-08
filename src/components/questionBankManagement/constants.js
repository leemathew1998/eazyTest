import { reactive } from "vue";
export const ruleForm = reactive({
  type: "", //类型
  level: "", //难度
  class: "", //分类
  content: "", //内容
  checkBoxList: [], //多选
  radio: "", //单选
  isTure: "", // 判断
  writeContent: "", //简答
  score: "", //分数
  analysis: "", //答案解析
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  optionE: "",
  optionF: "",
});

export const mapRuleForm = {
  type: "", //类型
  level: "", //难度
  class: "", //分类
  content: "", //内容
  checkBoxList: [], //多选
  radio: "", //单选
  isTure: "", // 判断
  writeContent: "", //简答
  score: "", //分数
  analysis: "", //答案解析
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  optionE: "",
  optionF: "",
};

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
      // type: "number",
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
    checked: false,
  },
  {
    label: "B",
    option: "optionB",
    checked: false,
  },
  {
    label: "C",
    option: "optionC",
    checked: false,
  },
  {
    label: "D",
    option: "optionD",
    checked: false,
  },
];
export const MultiRadioMap = [
  {
    label: "A",
    option: "optionA",
    checked: false,
  },
  {
    label: "B",
    option: "optionB",
    checked: false,
  },
  {
    label: "C",
    option: "optionC",
    checked: false,
  },
  {
    label: "D",
    option: "optionD",
    checked: false,
  },
  {
    label: "E",
    option: "optionE",
    checked: false,
  },
  {
    label: "F",
    option: "optionF",
    checked: false,
  },
];

export const toolbarConfig = {
  /* 工具栏配置 */
  toolbarKeys: [
    "bold",
    "clearStyle",
    "color",
    "bgColor",
    "divider",
    "emotion",
    "blockquote",
    "codeBlock",
    "insertTable",
    "headerSelect",
    "redo",
    "undo",
    "fullScreen",
  ],
};

export const template = `<p><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;">给定一个整数数组 </span>nums<span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"> 和一个整数目标值 </span>target<span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;">，请你在该数组中找出 </span><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"><strong>和为目标值 </strong></span><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"><em><code>target</code></em></span><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"> &nbsp;的那 </span><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"><strong>两个</strong></span><span style="color: rgb(38, 38, 38); background-color: rgb(255, 255, 255); font-size: 13px;"> 整数，并返回它们的数组下标。</span><span style="color: rgb(225, 60, 57); background-color: rgb(255, 255, 255); font-size: 13px;">(在此处输入题目内容......)</span></p><hr/><p>示例1<span style="color: rgb(225, 60, 57);">(可以在此处输入几个示例供参考)</span></p><pre><code class="language-css">输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。</code></pre><hr/><blockquote>测试用例<span style="color: rgb(225, 60, 57);">(填写测试用例，此处内容用户不可见！)<br>Output字段为固定输出字段，不可更改！<br>JavaScript主函数运行名称：twoSum<br>Java函数类运行名称：twoSum</span></blockquote><table style="width: 100%;"><tbody><tr><th colSpan="1" rowSpan="1" width="auto">nums</th><th colSpan="1" rowSpan="1" width="auto">target</th><th colSpan="1" rowSpan="1" width="auto">Output</th></tr><tr><td colSpan="1" rowSpan="1" width="auto">[2,7,11,15]</td><td colSpan="1" rowSpan="1" width="auto">9</td><td colSpan="1" rowSpan="1" width="auto">[0, 1]</td></tr><tr><td colSpan="1" rowSpan="1" width="auto">[3,2,4]</td><td colSpan="1" rowSpan="1" width="auto">6</td><td colSpan="1" rowSpan="1" width="auto">[1,2]</td></tr><tr><td colSpan="1" rowSpan="1" width="auto">[3,3]</td><td colSpan="1" rowSpan="1" width="auto">6</td><td colSpan="1" rowSpan="1" width="auto">[0,1]</td></tr></tbody></table><p><br></p>`;

export const mapKnowGory = {
  1: "前端",
  2: "后端",
  3: "设计",
  4: "测试",
};

export const mapTtype = {
  1: "单选题",
  2: "多选题",
  3: "判断题",
  4: "简答题",
  5: "编程题",
};
export const mapTtypes = {
  1: "单选",
  2: "多选",
  3: "判断",
  4: "简答",
  5: "编程",
};
export const reverseTtype = {
  单选: 1,
  多选: 2,
  判断: 3,
  简答: 4,
  编程: 5,
};

export const mapTdiff = {
  1: "简单",
  2: "中等",
  3: "困难",
};

export const sortMethod = (a, b) => {
  return Number(b.score) - Number(a.score);
};
export const sortMethod1 = (a, b) => {
  return Number(a.useNum) - Number(b.useNum);
};
