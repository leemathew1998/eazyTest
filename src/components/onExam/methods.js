import { computed, ref, watch } from "vue";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
const examStore = useExamStore();
const userStore = useUserStore();

//完成题目个数百分比相关
export let allCount = 1; //防止无穷小
export const finishedCount = computed(() => {
  const temp = Object.values(examStore.answers).flat();
  allCount = temp.length;
  return temp.filter((item) => {
    return item.answer.length !== 0;
  }).length;
});

//倒计时模块,需要后期修改，定时获取正确的时间，这个可能不准！
let totalSeconds = examStore.totalExamTime * 60; //总考试秒数
let startTimeStampForCountdownModule = null;
let timer = null;
export const renderTimeFormat = ref("00:00:00");
const countdownFn = () => {
  if (totalSeconds > 0) {
    const endTime = new Date().valueOf();
    if (endTime - startTimeStampForCountdownModule > 1000) {
      startTimeStampForCountdownModule = endTime;
      totalSeconds--;
      renderTimeFormat.value = timeFormat(totalSeconds);
    }
    requestAnimationFrame(countdownFn);
  } else {
    // 考试时间已经结束！弹出对话框！
    examFinished();
    cancelAnimationFrame(timer);
  }
};
const examFinished = () => {
  console.log("考试结束！");
};
const timeFormat = (seconds) => {
  return dayjs.duration(seconds * 1000).format("HH:mm:ss");
};
startTimeStampForCountdownModule = new Date().valueOf();
timer = requestAnimationFrame(countdownFn);

// 代码运行阶段
export const codeResult = ref("");
export const runTime = ref(0);
export const runCode = () => {
  const startTime = new Date().valueOf();
  const userCode = examStore.answers["编程"][examStore.runCodeIndex].answer;
  let runTimeCode = `${userCode}
 return addTwoNumber(twoSum);`;
  //获取测试用例，并开始执行
  let twoSum = [1, 2];
  let fn = new Function("twoSum", runTimeCode);
  let result;
  try {
    result = fn(twoSum);
    if (result === 3) {
      codeResult.value = "测试通过！";
      console.log("Output=>3, 与测试案例一致，代码运行成功");
    } else {
      codeResult.value = "测试未通过！";
      //结果不一致
      console.log(`结果不一致,${result}`);
    }
  } catch (e) {
    codeResult.value = e;
    result = e;
    //代码错误
    console.log(`代码错误,${result}`);
  }
  runTime.value = new Date().valueOf() - startTime;
  examStore.runCodeIndex = -1;
};

// RTC相关----------------------------------------------
