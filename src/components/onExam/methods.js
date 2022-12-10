import { computed, ref } from "vue";
import { useExamStore, useUserStore } from "@/store";
import pinia from "@/store/pinia.js";
import "@/utils/tracking-min.js";
import "@/utils/face-min.js";
import { ElMessage, ElNotification } from "element-plus";
import dayjs from "dayjs";
import lodash from "lodash";
import { EncryptScore } from "@/utils/methods.js";
import duration from "dayjs/plugin/duration";
import { submitAnswers, submitAnswers2, updateCodingScore, updateExamStatus } from "@/api/examBankManagement.js";
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
export const runCode = async (upload = false, score = 0, tid = 0) => {
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
        // console.log("开始之前的answer和result", answer, result);
        if (name.includes("[]")) {
          answer = answer.split("[")[1].split("]")[0];
          //数组
          if (name.includes("object") || name.includes("Object")) {
            result = JSON.stringify(result);
          } else {
            result = String(result);
          }
          // console.log("进入数组判断", answer, result);
          flag = solveArray(answer, result);
        } else if (name.includes("object") || name.includes("Object")) {
          //字符串转对象,不能用JSON.parse，
          answer = answer.split("{")[1].split("}")[0];
          let temp_obj_ = {};
          answer.split(",").forEach((item) => {
            let [key, value] = item.split(":");
            temp_obj_[key] = value;
          });
          answer = temp_obj_;
          // console.log("进入对象判断", answer, result);
          flag = solveObject(answer, result);
        } else {
          // console.log("进入else判断");
          if (answer != result) {
            flag = false;
          }
        }
        // console.log("结束的answer和result", answer, result);
      });
    } catch (e) {
      flag = false;
      result = `代码错误:${result}`;
      //代码错误
    }
    if (!flag) {
      //如果有一个测试用例不通过，就不用再循环了
      break;
    }
  }
  codeResult.value = flag ? `测试用例通过！` : "测试用例未通过！";
  runTime.value = new Date().valueOf() - startTime;
  //处理提交得分接口
  if (upload) {
    examStore.runCodeIndex = -1;
    const payload = JSON.stringify({
      ansScore: flag ? EncryptScore(score) : EncryptScore(0),
      tid: String(tid),
      examId: String(examStore.examId),
      userId: String(userStore.userId),
    });
    const res = await updateCodingScore(payload);
    if (res.code !== 200) {
      ElMessage.error(res.message);
    }
  }
  flag = true;
};
//处理数组
const solveArray = (answer, result) => {
  let flag = true;
  const answer__ = answer.split(",");
  const result__ = result.split(",");
  for (let i_ = 0; i_ < answer__.length; i_++) {
    // console.log("进入数组循环", answer__[i_], result__[i_]);
    if (!result__.includes(answer__[i_])) {
      flag = false;
      break;
    }
  }
  for (let i_ = 0; i_ < result__.length; i_++) {
    // console.log("进入数组循环", answer__[i_], result__[i_]);
    if (!answer__.includes(result__[i_])) {
      flag = false;
      break;
    }
  }
  return flag;
};
const solveObject = (answer, result) => {
  let flag = true;
  for (let key in result) {
    // console.log(key, answer[key], result[key], answer.hasOwnProperty(key));
    if (!answer.hasOwnProperty(key) || answer[key] != result[key]) {
      flag = false;
      break;
    }
  }
  for (let key in answer) {
    // console.log(key, answer[key], result[key], answer.hasOwnProperty(key));
    if (!result.hasOwnProperty(key) || answer[key] != result[key]) {
      flag = false;
      break;
    }
  }
  return flag;
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

export const handlerAnswersV3 = lodash.debounce(
  async (questions) => {
    const payload = [];
    Object.keys(questions).forEach((type) => {
      questions[type].forEach((item, index) => {
        let userAns;
        if (
          JSON.stringify(examStore.answers[type][index].answer) !=
          JSON.stringify(examStore.oldAnswers[type][index].answer)
        ) {
          if (type == "多选") {
            userAns = examStore.answers[type][index].answer.sort((a, b) => a.charCodeAt() - b.charCodeAt()).join("");
          } else if (type == "编程") {
            userAns = JSON.stringify(examStore.answers[type][index].answer);
          } else if (type == "判断") {
            userAns = examStore.answers[type][index].answer == "1" ? "正确" : "错误";
          } else {
            userAns = examStore.answers[type][index].answer;
          }
          payload.push({
            tid: item.tid,
            userId: userStore.userId,
            userAns: userAns,
            examId: examStore.examId,
          });
        }
      });
    });
    let res;
    if (payload.length > 0) {
      res = await submitAnswers(payload);
      if (res.code !== 200) {
        ElNotification.error("提交失败，内容已保存，请及时联系管理员！");
      }
    }
    examStore.oldAnswers = lodash.cloneDeep(examStore.answers);
  },
  10000,
  { maxWait: 10000 },
);

//处理实时答案传输，
export const handlerAnswersAll = async (questions, isFinalSubmit = false) => {
  const payload = [];
  const codeQuestionPromise = [];
  Object.keys(questions).forEach((type) => {
    questions[type].forEach((item, index) => {
      let userAns;
      if (type == "多选") {
        userAns = examStore.answers[type][index].answer.sort((a, b) => a.charCodeAt() - b.charCodeAt()).join("");
      } else if (type == "编程") {
        userAns = JSON.stringify(examStore.answers[type][index].answer);
        if (isFinalSubmit) {
          //除此之外，还需要专门处理编程题得分
          examStore.runCodeIndex = index;
          codeQuestionPromise.push({
            upload: true,
            score: item.score,
            tid: item.tid,
          });
        }
      } else if (type == "判断") {
        userAns = examStore.answers[type][index].answer == "1" ? "正确" : "错误";
      } else {
        userAns = examStore.answers[type][index].answer;
      }
      payload.push({
        tid: item.tid,
        userId: userStore.userId,
        userAns: userAns,
        examId: examStore.examId,
      });
    });
  });
  let res;
  if (isFinalSubmit) {
    res = await submitAnswers2(payload);
  } else {
    res = await submitAnswers(payload);
  }
  if (codeQuestionPromise.length > 0) {
    //处理编程题得分
    codeQuestionPromise.forEach((item) => {
      runCode(item.upload, item.score, item.tid);
    });
  }
  if (res.code === 200) {
    ElNotification.success("提交成功！");
  } else {
    ElNotification.error("提交失败，内容已保存，请及时联系管理员！");
  }
};

export const checkAllQuestionsIsFinished = () => {
    //检查是不是全部的题目都做完了
  let isFinished = true;
  Object.keys(examStore.answers).forEach((type) => {
    examStore.answers[type].forEach((item, index) => {
      if (type === "编程") {
        if (item.JavaScriptlength === item.answer.JavaScript.length) {
          isFinished = false;
        }
      } else {
        if (item.answer.length === 0) {
          isFinished = false;
        }
      }
    });
  });
  return isFinished;
};

export const updateIsTrue = async () => {
  //更新考试状态为已完成，不能再次进入了
  const res = await updateExamStatus({
    examId: examStore.examId,
    userId: userStore.userId,
  });
  if (res.code !== 200) {
    ElNotification.error({
      title: "错误",
      message: res.message,
    });
  }
};
