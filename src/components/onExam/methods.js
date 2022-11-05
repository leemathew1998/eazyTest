import { computed, ref } from "vue";
import { useExamStore } from "@/store";
import pinia from "@/store/pinia.js";
import "@/utils/tracking-min.js";
import "@/utils/face-min.js";
import { ElMessage } from "element-plus";

const examStore = useExamStore(pinia);

//完成题目个数百分比相关
export let allCount = 1; //防止无穷小
export const finishedCount = computed(() => {
  const temp = Object.values(examStore.answers).flat();
  allCount = temp.length;
  return temp.filter((item) => {
    return item.answer.length !== 0;
  }).length;
});

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
