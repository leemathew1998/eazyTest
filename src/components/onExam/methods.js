import { computed, ref } from "vue";
import { useExamStore } from "@/store";
import pinia from "@/store/pinia.js";
import "@/utils/tracking-min.js";
import "@/utils/face-min.js";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
const examStore = useExamStore(pinia);

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
export const runCode = () => {
  //开始时间
  const startTime = new Date().valueOf();
  //方便后面取值
  const piniaItem = examStore.answers["编程"][examStore.runCodeIndex];
  //剩余需要传递的参数名称
  let leftParamsName = Object.keys(piniaItem.testInput).filter(
    (item) => !item.includes("__OutPut") && item !== "javaScriptFunName",
  );
  let OutputParamsName = Object.keys(piniaItem.testInput).filter((item) => item.includes("__OutPut"));
  console.log(leftParamsName, OutputParamsName);
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
      params += `let ${trueName} = ${piniaItem.testInput[name][i]};\n`;
    });
    //运行代码字符串拼接，主要拼接return语句，返回执行结果
    let runTimeCode = `${piniaItem.answer[piniaItem.defaultCodeLanguage]}
      ${params}
      return ${piniaItem.testInput.javaScriptFunName}(${paramsName.slice(0, -1)});`;
    console.log(runTimeCode);
    //运行代码 new Function
    let fn = new Function(runTimeCode);
    try {
      result = fn();
      //开始循环output
      OutputParamsName.forEach((name) => {
        let answer;
        let [type, etc] = name.split(":"); //type=number[]
        // 对于结果，我们暂且不考虑太多，把他们都转成字符串比较吧
        if (type.includes("[]")) {
          //数组
          result = String(result);
          answer = piniaItem.testInput[name][i];
          answer = answer.split("[")[1].split("]")[0];
        }
        if (answer != result) {
          console.log("不相等", answer, result);
          flag = false;
          result = `测试用例未通过！`;
        } else {
          console.log("相等");
        }
      });
    } catch (e) {
      flag = false;
      result = `代码错误:${result}`;
      //代码错误
      console.log(`代码错误:${result}`);
    }
  }
  if (flag) {
    result = `测试用例通过！`;
  }
  console.log("最后flag", flag);
  codeResult.value = result;
  flag = true;
  runTime.value = new Date().valueOf() - startTime;
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
