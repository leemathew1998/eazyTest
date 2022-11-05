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
            <span class="leftTime-personModule mt-1">{{ finishedCount }}/100</span>
            <el-progress
              :show-text="false"
              :stroke-width="14"
              :percentage="Math.floor(finishedCount / allCount)"
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
          <el-input class="m m-auto" v-model="codeResult" :rows="8" size="normal" type="textarea" disabled></el-input>
        </div>
      </div>
    </template>
  </BlankCard>
  <StartFullscreen v-model:startFullscreen="startFullscreen"></StartFullscreen>
</template>
<script setup>
import { allCount, finishedCount, codeResult, runCode, runTime, initTracking } from "./methods.js";
import BlankCard from "@/components/blankCardWithOutBorder.vue";
import StartFullscreen from "./startFullscreen.vue";
import { ref, watch } from "vue";
import { useExamStore } from "@/store";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { exitFullscreen, antiCheatingMethod, removeEventListeners } from "@/utils/antiCheatingMethod.js";
dayjs.extend(duration);
const examStore = useExamStore();
const loading = ref(false);
const startFullscreen = ref(true);
//倒计时模块,需要后期修改，定时获取正确的时间，这个可能不准！
let totalSeconds = examStore.totalExamTime * 30; //总考试秒数
let startTimeStampForCountdownModule = null;
let timer = null;
const renderTimeFormat = ref("00:00:00");
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
  //退出全屏
  exitFullscreen();
  // 卸载监听器
  removeEventListeners();
  console.log("考试结束！");
};
const timeFormat = (seconds) => {
  return dayjs.duration(seconds * 1000).format("HH:mm:ss");
};
// 同意了开始考试！
watch(startFullscreen, (newVal) => {
  if (!newVal) {
    startExam();
  }
});
const startExam = async () => {
  loading.value = true;
  // 开启人脸识别
  initTracking();
  setTimeout(() => {
    loading.value = false;
  }, 3000);
  startTimeStampForCountdownModule = new Date().valueOf();
  timer = requestAnimationFrame(countdownFn);
  // 开启防作弊检测
  await antiCheatingMethod();
};

//代码运行
watch(
  () => examStore.runCodeIndex,
  (newVal) => {
    if (newVal !== -1) {
      runCode();
    }
  },
);
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
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
/deep/.el-textarea__inner {
  width: 100%;
}
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1) !important;
  color: #fff;
}
</style>
