<template>
  <BasicCard>
    <template #title> 考试剩余时间 </template>
    <template #mainContent>
      <div class="count-down-container">
        {{ time }}
      </div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "./basicCard.vue";
import { useExamStore } from "@/store";
import { onMounted, onUnmounted, ref } from "vue";
import { timeFormat } from "@/components/onExam/methods.js";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
const examStore = useExamStore();
let timer;
let minuteCount = 0;
let startTime = null;
let totalSeconds = 0;
const time = ref("00:00:00");
onMounted(() => {
  startTime = dayjs().valueOf();
  totalSeconds = examStore.endTimestamp - examStore.startTimestamp;
  timer = requestAnimationFrame(countDownTime);
});
onUnmounted(() => {
  cancelAnimationFrame(timer);
  timer = null;
});
//倒计时模块,需要后期修改，定时获取正确的时间，这个可能不准！
//修正方法，每一分钟定时获取一次准确时间，与实际的时间进行比较！
const countDownTime = () => {
  const endTime = dayjs().valueOf();
  if (totalSeconds <= 0) {
    ElMessageBox.alert("本场考试已结束！", "监考管理", {
      confirmButtonText: "确定",
      callback: (action) => { },
    });
    cancelAnimationFrame(timer);
    return;
  }
  if (endTime - startTime > 1000) {
    startTime = endTime;
    minuteCount++;
    totalSeconds--;
    if (minuteCount === 60) {
      //一分钟了，开始获取剩余时间
      totalSeconds = examStore.endTimestamp - dayjs().unix();
      minuteCount = 0;
    }
    time.value = timeFormat(totalSeconds);
  }

  timer = requestAnimationFrame(countDownTime);
};
</script>
<style lang="less" scoped>
.count-down-container {
  display: flex;
  justify-content: center;
  border-width: 0px;
  background-color: rgba(240, 240, 240, 1);
  border: none;
  border-radius: 115px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 20px;
  color: #fa1f1f;
}
</style>
