<template>
  <BlankCard>
    <template #mainContent class="h-full">
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
    </template>
  </BlankCard>
</template>
<script setup>
import "@/utils/tracking-min.js";
import "@/utils/face-min.js";
import { allCount, finishedCount, renderTimeFormat,initConnect } from "./methods.js";
import BlankCard from "@/components/blankCard.vue";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useExamStore } from "@/store";
const examStore = useExamStore();
let startTimeStamp = null;
const loading = ref(true);
/*
 *@Author: jkwei
 *@Date: 2022-10-28 19:09:01
 *@Description: 此页面会保证尽可能的简洁，因为rtc部分会占用很大空间，所以其余代码能整合的会放在./methods文件中！
 */

// RTC相关


// tracking相关
let tracker = new tracking.ObjectTracker("face");
tracker.setInitialScale(2);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);
const initTracking = () => {
  tracking.track("#video", tracker, {
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
onMounted(() => {
  startTimeStamp = new Date().valueOf();
  initTracking();
  setTimeout(() => {
    loading.value = false;
    initConnect()
  }, 1000);
});
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
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1) !important;
  color: #fff;
}
</style>
