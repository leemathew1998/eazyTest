<template>
  <BlankCard>
    <template #mainContent class="h-full">
      <div class="h-full flex flex-col justify-between">
        <div class="top">
          <div class="flex items-center justify-center" v-loading="loading">
            <video id="video" class="w-40 h-full" preload autoplay loop muted></video>
          </div>
          <div class="flex flex-col items-center mb-4">
            <span class="leftTime-personModule">剩余时间</span>
            <span class="countdown-personModule">{{ renderTimeFormat }}</span>
            <span class="leftTime-personModule mt-4">当前进度</span>
            <span class="leftTime-personModule mt-1">{{ finishedCount }}/{{ props.count }}</span>
            <el-progress
              :show-text="false"
              :stroke-width="14"
              :percentage="Math.floor((finishedCount / props.count) * 100)"
              class="w-full"
              color="#31969A"
            />
          </div>
        </div>
        <div class="codeExecutionArea" v-if="examStore.runCodeIndex !== -1">
          <el-divider direction="horizontal" content-position="center"></el-divider>
          <div class="runtime-info">
            <h3 class="status">已完成</h3>
            <span class="runtime">执行用时：{{ runTime }} ms</span>
          </div>
          <el-input
            class="m m-auto w-full"
            v-model="codeResult"
            :rows="8"
            size="normal"
            type="textarea"
            disabled
          ></el-input>
        </div>
      </div>
    </template>
  </BlankCard>
  <canvas id="canvas" style="display: none"></canvas>
  <StartFullscreen v-model:startFullscreen="startFullscreen"></StartFullscreen>
</template>
<script setup>
import {
  finishedCount,
  codeResult,
  runCode,
  runTime,
  initTracking,
  stopTracking,
  getPhotos,
  timeFormat,
} from "./methods.js";
import BlankCard from "@/components/blankCardWithOutBorder.vue";
import StartFullscreen from "./startFullscreen.vue";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { submitAnswers } from "@/api/examBankManagement.js";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import emiter from "@/utils/mitt.js";
import {
  exitFullscreen,
  antiCheatingMethod,
  removeEventListeners,
  getBrowserType,
} from "@/utils/antiCheatingMethod.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const props = defineProps({
  count: String | Number,
  questions: Object | Array,
});
emiter.on("submit-exam", (res) => {
  res && examFinished();
});
emiter.on("exitFullScreen", () => {
  startFullscreen.value = true;
});
const userStore = useUserStore();
const examStore = useExamStore();
const router = useRouter();
const loading = ref(false);
let startFullscreen = ref(false);
onMounted(() => {
  startFullscreen.value = true;
});
onBeforeUnmount(() => {
  emiter.off("submit-exam");
});
/*
 *@Author: jkwei
 *@Date: 2022-11-05 15:01:15
 *@Description: 不得不承认，此页面是整个系统中代码质量最差的一个页面，由于有些方法必须要放在这个页面中，
 导致引用了太多，页面质量及其差。
*/
let totalSeconds; //考试总时间(秒)
//判断当前时间是否在考试时间内
if (examStore.startTimestamp < dayjs().unix() && examStore.endTimestamp > dayjs().unix()) {
  //在考试时间内，需要在总时长的基础上减去已经考试的时间
  console.log("在考试时间内");
  totalSeconds = examStore.endTimestamp - dayjs().unix(); //总考试秒数
} else {
  totalSeconds = examStore.endTimestamp - examStore.startTimestamp; //总考试秒数
}
//倒计时模块,需要后期修改，定时获取正确的时间，这个可能不准！
//修正方法，每一分钟定时获取一次准确时间，与实际的时间进行比较！
let minuteCount = 0;
let startTimeStampForCountdownModule = null;
let timer = null;
const renderTimeFormat = ref("00:00:00");
const countdownFn = () => {
  if (totalSeconds > 0) {
    const endTime = new Date().valueOf();
    if (endTime - startTimeStampForCountdownModule > 1000) {
      minuteCount++;
      getPhotos();
      startTimeStampForCountdownModule = endTime;
      totalSeconds--;
      if (minuteCount === 60) {
        //还需要随机进行答案提交，由于考虑服务器压力，需要随机时间进行提交
        setTimeout(handlerAnswers, Math.ceil(Math.random() * 10));
        //一分钟了，开始获取剩余时间
        totalSeconds = examStore.endTimestamp - dayjs().unix();
        minuteCount = 0;
      }
      renderTimeFormat.value = timeFormat(totalSeconds);
    }

    timer = requestAnimationFrame(countdownFn);
  } else {
    // 考试时间已经结束！弹出对话框！
    examFinished();
  }
};
const examFinished = () => {
  //删除所有的事件监听
  cancelAnimationFrame(timer);
  // 卸载监听器
  removeEventListeners();
  //退出全屏
  exitFullscreen();
  //停止人脸识别
  // stopTracking();
  //提交答案
  handlerAnswers();
  document.getElementById("video").srcObject = null;
  console.log("考试结束！");
  router.push("/exam/userManagement");
};

// 同意了开始考试！
watch(startFullscreen, (newVal) => {
  if (!newVal) {
    loading.value = true;
    startExam();
  }
});
const startExam = () => {
  if (getBrowserType() !== "Chrome") {
    ElMessage.warning("建议使用谷歌浏览器进行考试！");
  }
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  loading.value = false;
  //倒计时
  startTimeStampForCountdownModule = new Date().valueOf();
  timer = requestAnimationFrame(countdownFn);
  // 开启防作弊检测
  antiCheatingMethod();
};

//处理实时答案传输，
const handlerAnswers = async () => {
  const payload = [];
  Object.keys(props.questions.value).forEach((type) => {
    props.questions.value[type].forEach((item, index) => {
      let userAns;
      if (type == "多选") {
        userAns = examStore.answers[type][index].answer.join(",");
      } else if (type == "编程") {
        userAns = JSON.stringify(examStore.answers[type][index].answer);
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
  const res = await submitAnswers(payload);
  if (res.code === 200) {
    console.log("提交成功！");
  }
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
#video {
  border-radius: 8px;
}
.leftTime-personModule {
  white-space: nowrap;
  text-transform: none;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #333333;
  text-align: left;
}
.countdown-personModule {
  white-space: nowrap;
  text-transform: none;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #fa1f1f;
  margin-top: 0.5rem;
}
:deep(.el-button) {
  border-width: 0px;
  display: flex;
  font-family: "思源黑体 CN Normal", "思源黑体 CN Regular", "思源黑体 CN", sans-serif;
  font-weight: 350;
  font-style: normal;
  font-size: 14px;
  color: #333333;
  background-color: rgba(0, 121, 106, 0);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(217, 217, 217, 1);
  border-radius: 6px;
  padding: 0 1.5em;
}
.runtime-info {
  display: flex;
  align-items: center;
  .status {
    white-space: nowrap;
    font-size: 16px;
    color: rgb(55, 113, 23);
    font-weight: 500;
    margin-right: 20px;
  }
  .runtime {
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: rgb(223, 223, 223);
  }
}
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1) !important;
  color: #fff;
}
:deep(.el-textarea__inner) {
  width: 100% !important;
}
</style>

//以下代码注释掉！之前在startExam下面 // navigator.getUserMedia( // { video: true }, // async function onSuccess(stream)
{ // console.log("已点击允许摄像头,开启成功"); // loading.value = false; // // 开启人脸识别 // initTracking(); //
//倒计时 // startTimeStampForCountdownModule = new Date().valueOf(); // timer = requestAnimationFrame(countdownFn); //
// 开启防作弊检测 // await antiCheatingMethod(); // // 开启获取照片上传 // }, // function onError(error) { //
startFullscreen.value = false; // ElMessage.error("暂未获取到摄像头权限！请开启后重新进入此页面！"); //
console.log("错误：", error); // return; // }, // );
