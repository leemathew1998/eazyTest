import * as xlsx from "xlsx";
import { getTemplateFile } from "@/api/questionBankManagement.js";
import { reverseTtype, reverseMapTdiff, reverseMapKnowGory } from "./constants.js";
import { useUserStore } from "@/store";
import { addQuestion } from "@/api/questionBankManagement.js";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
const userStore = useUserStore();

export function readFile(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
  });
}

//解析文件并导入
export const solveFile = async (file) => {
  let data = await readFile(file);
  let workbook = xlsx.read(data, { type: "binary" }),
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  data = xlsx.utils.sheet_to_json(worksheet);
  // 打印结果加下图
  const mapType = {};
  const batchData = [];
  //   console.log(data);
  data.forEach((ques) => {
    let payload = {};
    //清除空格,基础模块赋值
    ques["题型"] = ques["题型"]?.split(" ").join("").slice(0, 2);
    payload.ttype = reverseTtype[ques["题型"]];
    payload.tdiff = String(reverseMapTdiff[ques["难度"]?.split(" ").join("")]);
    payload.knowGory = reverseMapKnowGory[ques["知识分类"]?.split(" ").join("")];
    payload.score = ques["分数"];
    payload.tproblem = ques["试题内容"];
    payload.answerInfo = ques["解析"] ? ques["解析"] : "";
    //用户相关
    payload.useNum = 0;
    payload.createBy = userStore.username;
    payload.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (ques["题型"] === "单选") {
      payload.ta = ques["选项A"];
      payload.tb = ques["选项B"];
      payload.tc = ques["选项C"];
      payload.td = ques["选项D"];
      payload.answer = ques["答案"].split(" ").join("");
    } else if (ques["题型"] === "多选") {
      payload.ta = ques["选项A"];
      payload.tb = ques["选项B"];
      payload.tc = ques["选项C"];
      payload.td = ques["选项D"];
      payload.te = ques["选项E"];
      payload.tf = ques["选项F"];
      payload.answer = ques["答案"]
        .split(" ")
        .join("")
        .split("")
        .sort((a, b) => a.charCodeAt() - b.charCodeAt())
        .join("");
    } else if (ques["题型"] === "判断" || ques["题型"] === "简答") {
      payload.answer = ques["答案"].split(" ").join("");
    }
    batchData.push(addQuestion(payload));
  });
  const res = await Promise.allSettled(batchData);
  res.find((item) => item.status === "rejected")
    ? ElMessage.error("部分试题导入失败！")
    : ElMessage.success("导入成功");
};

//下载模版文件
export const downloadTemplate = async () => {
  const res = await getTemplateFile();
  const link = document.createElement("a");
  link.style.dispaly = "none";
  let binaryData = [];
  binaryData.push(res);
  link.href = window.URL.createObjectURL(new Blob(binaryData));
  link.setAttribute("download", "题库模版文件.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const batchUploadData = () => {
  //基础数据
  let payload = {
    ta: ruleForm.optionA,
    tb: ruleForm.optionB,
    tc: ruleForm.optionC,
    td: ruleForm.optionD,
    te: ruleForm.optionE,
    tf: ruleForm.optionF,
    answer: ruleForm.checkBoxList.sort((a, b) => a.charCodeAt() - b.charCodeAt()).join(""),
  };
};
