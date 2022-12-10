import * as xlsx from "xlsx";
import { getTemplateFile } from "@/api/questionBankManagement.js";
import { reverseTtype, reverseMapTdiff, reverseMapKnowGory } from "./constants.js";
import { useUserStore } from "@/store";
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
  const batchData = [];
  if (!data.length) {
    ElMessage.error("文件内容为空");
    return { batchData, alertInfoStr: "" };
  }
  let alertInfo = [];
  data.forEach((ques, index) => {
    let payload = {};
    //对数据进行校验，如果有错误，进行标注
    alertInfo[index] = [];
    //清除空格,基础模块赋值
    ques["题型"] = ques["题型"]?.split(" ").join("").slice(0, 2);
    ques["题型"] ? "" : alertInfo[index].push(`题型为空`);
    payload.ttype = reverseTtype[ques["题型"]];
    payload.tdiff = String(reverseMapTdiff[ques["难度"]?.split(" ").join("")]);
    ques["难度"]?.split(" ").join("") ? "" : alertInfo[index].push(`难度为空`);
    payload.knowGory = reverseMapKnowGory[ques["知识分类"]?.split(" ").join("")];
    ques["知识分类"]?.split(" ").join("") ? "" : alertInfo[index].push(`知识分类为空`);
    payload.score = ques["分数"];
    //判断分数是不是数字
    if (isNaN(payload.score)) {
      alertInfo[index].push(`分数需要是数字`);
    }
    ques["分数"] ? "" : alertInfo[index].push(`分数为空`);

    payload.tproblem = ques["试题内容"];
    ques["试题内容"] ? "" : alertInfo[index].push(`试题内容为空`);
    payload.answerInfo = ques["解析"];
    ques["解析"] ? "" : alertInfo[index].push(`解析为空`);
    //用户相关
    payload.useNum = 0;
    payload.createBy = userStore.username;
    payload.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (ques["题型"] === "单选") {
      payload.ta = String(ques["选项A"]) || "";
      payload.tb = String(ques["选项B"]) || "";
      payload.tc = String(ques["选项C"]) || "";
      payload.td = String(ques["选项D"]) || "";
      payload.answer = ques["答案"]?.split(" ").join("").toUpperCase();
      //需要四个选项两两不相等,且选项不能为空

      if (
        payload.ta === payload.tb ||
        payload.ta === payload.tc ||
        payload.ta === payload.td ||
        payload.tb === payload.tc ||
        payload.tb === payload.td ||
        payload.tc === payload.td
      ) {
        alertInfo[index].push(`单选题选项重复`);
      }
      if (!payload.ta || !payload.tb || !payload.tc || !payload.td) {
        alertInfo[index].push(`单选题选项为空`);
      }
      //需要有答案,还需要答案只能是ABCD
      if (!payload.answer || !["A", "B", "C", "D"].includes(payload.answer)) {
        alertInfo[index].push(`单选题答案错误`);
      }
    } else if (ques["题型"] === "多选") {
      payload.ta = String(ques["选项A"]) || "";
      payload.tb = String(ques["选项B"]) || "";
      payload.tc = String(ques["选项C"]) || "";
      payload.td = String(ques["选项D"]) || "";
      payload.te = String(ques["选项E"]) || "";
      payload.tf = String(ques["选项F"]) || "";
      payload.answer =
        ques["答案"]
          ?.split(" ")
          .join("")
          .split("")
          .map((char) => char.toUpperCase())
          .sort((a, b) => a.charCodeAt() - b.charCodeAt())
          .join("") || "";
      //需要六个选项两两不相等
      if (
        payload.ta === payload.tb ||
        payload.ta === payload.tc ||
        payload.ta === payload.td ||
        payload.ta === payload.te ||
        payload.ta === payload.tf ||
        payload.tb === payload.tc ||
        payload.tb === payload.td ||
        payload.tb === payload.te ||
        payload.tb === payload.tf ||
        payload.tc === payload.td ||
        payload.tc === payload.te ||
        payload.tc === payload.tf ||
        payload.td === payload.te ||
        payload.td === payload.tf ||
        payload.te === payload.tf
      ) {
        alertInfo[index].push(`多选题选项重复`);
      }
      //每个选项不能为空
      if (!payload.ta || !payload.tb || !payload.tc || !payload.td || !payload.te || !payload.tf) {
        alertInfo[index].push(`多选题选项为空`);
      }
      //需要有答案,还需要答案只能是ABCDEF
      if (!payload.answer || !["A", "B", "C", "D", "E", "F"].includes((char) => payload.answer.includes(char))) {
        alertInfo[index].push(`多选题答案错误`);
      }
    } else if (ques["题型"] === "判断" || ques["题型"] === "简答") {
      payload.answer = ques["答案"].split(" ").join("") || "";
      //需要有答案
      if (!payload.answer) {
        alertInfo[index].push(`答案为空`);
      }
    }
    //校验完成，如果有错误信息，就不添加到数据库
    if (alertInfo[index].length === 0) {
      batchData.push(payload);
    }
  });
  //循环错误信息，拼接成字符串
  let alertInfoStr = "";
  alertInfo.forEach((item, index) => {
    if (item.length > 0) {
      alertInfoStr += `<span style="color:red">第${index + 1}题: ${item.join("，")}</span>`;
      //加入换行符
      alertInfoStr += "<br>";
    }
  });
  return { batchData, alertInfoStr };
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
