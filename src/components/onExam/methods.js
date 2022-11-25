import { computed, ref } from "vue";
import { useExamStore, useUserStore } from "@/store";
import pinia from "@/store/pinia.js";
import "@/utils/tracking-min.js";
import "@/utils/face-min.js";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { updateCodingScore } from "@/api/examBankManagement.js";
dayjs.extend(duration);
const examStore = useExamStore(pinia);
const userStore = useUserStore(pinia);

//完成题目个数百分比相关
export let allCount = 1; //防止无穷小
export const finishedCount = computed(() => {
  const temp = Object.values(examStore.answers).flat();
  return temp.filter((item) => {
    if (item.hasOwnProperty("defaultCodeLanguage")) {
      return item.answer[item.defaultCodeLanguage].length !== item[`${item.defaultCodeLanguage}length`];
    } else {
      return item.answer.length !== 0;
    }
  }).length;
});
export const timeFormat = (seconds) => {
  return dayjs.duration(seconds * 1000).format("HH:mm:ss");
};
// 代码运行阶段
export const codeResult = ref("");
export const runTime = ref(0);
export const runCode = (upload = false, score = 0, tid = 0) => {
  //开始时间
  const startTime = new Date().valueOf();
  //方便后面取值
  const piniaItem = examStore.answers["编程"][examStore.runCodeIndex];
  //剩余需要传递的参数名称
  let leftParamsName = Object.keys(piniaItem.testInput).filter(
    (item) => !item.includes("__OutPut") && item !== "javaScriptFunName",
  );
  let OutputParamsName = Object.keys(piniaItem.testInput).filter((item) => item.includes("__OutPut"));
  let result;
  //获取测试用例，并开始执行
  let flag = true; //是否运行成功标志
  for (let i = 0; i < piniaItem.testInput[leftParamsName[0]].length; i++) {
    //总体需要循环i次
    let params = "";
    let paramsName = "";
    leftParamsName.forEach((name) => {
      //现在每个参数都有类型，需要根据类型进行转换，例如name=nums:number[]__InPut
      let [trueName, type] = name.split(":"); //trueName=nums,type=number[]__InPut
      paramsName += `${trueName},`;
      type = type.split("__InPut")[0]; //type=number[]
      if (type === "string" || type === "String") {
        params += `let ${trueName} = '${piniaItem.testInput[name][i]}';\n`;
      } else {
        params += `let ${trueName} = ${piniaItem.testInput[name][i]};\n`;
      }
      //此刻需要注意，如果是字符串，需要加上引号
    });
    //运行代码字符串拼接，主要拼接return语句，返回执行结果
    let runTimeCode = `${piniaItem.answer[piniaItem.defaultCodeLanguage]}
      ${params}
      return ${piniaItem.testInput.javaScriptFunName}(${paramsName.slice(0, -1)});`;
    //运行代码 new Function
    let fn = new Function(runTimeCode);
    try {
      result = fn();
      //开始循环output
      OutputParamsName.forEach((name) => {
        let answer = piniaItem.testInput[name][i];
        // let [type, etc] = name.split(":"); //type=number[]
        // 对于结果，我们暂且不考虑太多，把他们都转成字符串比较吧
        //11.25日修改，处理好数组和对象的情况，数组是有顺序的，对象直接变成string会直接成为[object Object]也不可以。
        if (!name.includes("object") && !name.includes("Object")) {
          result = String(result);
        }
        if (name.includes("[]")) {
          answer = answer.split("[")[1].split("]")[0];
          //数组
          if (name.includes("object") || name.includes("Object")) {
            result = JSON.stringify(result);
          } else {
            result = String(result);
          }
          result = solveArray(answer, result, flag);
        } else if (name.includes("object") || name.includes("Object")) {
          //字符串转对象,不能用JSON.parse，
          answer = answer.split("{")[1].split("}")[0];
          let temp_obj_ = {};
          answer.split(",").forEach((item) => {
            let [key, value] = item.split(":");
            temp_obj_[key] = value;
          })
          answer = temp_obj_;
          result = solveObject(answer, result, flag);
        } else {
          if (answer != result) {
            flag = false;
            result = `测试用例未通过！`;
          }
        }
      });
    } catch (e) {
      flag = false;
      result = `代码错误:${result}`;
      //代码错误
    }
  }
  if (flag) {
    result = `测试用例通过！`;
  }
  codeResult.value = result;
  runTime.value = new Date().valueOf() - startTime;
  //处理提交得分接口
  if (upload) {
    examStore.runCodeIndex = -1;
    const payload = {
      ansScore: flag ? String(score) : "0",
      tid: String(tid),
      examId: String(examStore.examId),
      userId: String(userStore.userId),
    };
    updateCodingScore(payload);
  }
  flag = true;
};
//处理数组
const solveArray = (answer, result, flag) => {
  const answer__ = answer.split(",");
  const result__ = result.split(",");
  for (let i_ = 0; i_ < answer__.length; i_++) {
    if (answer__[i_] != result__[i_]) {
      flag = false;
      break;
    }
  }
  return flag ? "测试用例通过！" : "测试用例未通过！";
};
const solveObject = (answer, result, flag) => {
  for (let key in result) {
    if (!answer.hasOwnProperty(key) || answer[key] != result[key]) {
      flag = false;
      break;
    }
  }
  return flag ? "测试用例通过！" : "测试用例未通过！";
};

export const stopTracking = () => {
  stopTracker.stop();
};
// tracking相关
let startTimeStamp = null;
let tracker;
let stopTracker;
export const initTracking = () => {
  startTimeStamp = new Date().valueOf();
  tracker = new tracking.ObjectTracker("face");
  tracker.setInitialScale(2);
  tracker.setStepSize(2);
  tracker.setEdgesDensity(0.1);
  stopTracker = tracking.track("#video", tracker, {
    camera: true,
  });
  tracker.on("track", function (event) {
    if (event.data.length > 0) {
      startTimeStamp = new Date().valueOf();
    } else {
      if (new Date().valueOf() - startTimeStamp > examStore.trackingTimeRange) {
        // 一分钟没有人脸！报警！
        ElMessage.error("请规范考试动作，相关异常行为已记录！");
        startTimeStamp = new Date().valueOf();
      }
    }
  });
};

export const getPhotos = (video) => {
  var video = document.getElementById("video");
  var canvas = document.getElementById("canvas");
  canvas.width = 160;
  canvas.height = 120;
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, 160, 120);
  var dataURL = canvas.toDataURL("image/png");
  // console.log(dataURL);
};
