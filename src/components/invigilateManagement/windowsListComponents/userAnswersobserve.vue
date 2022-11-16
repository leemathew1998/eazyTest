<template>
  <BasicCard>
    <template #title> 用户答题情况 </template>
    <template #mainContent>
      <div class="h-full w-full overflow-hidden">
        <div id="scoreCountingChart" class="h-full overflow-scroll"></div>
      </div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { echartOption, mapTimeLoop } from "./constants.js";
import { onMounted, reactive, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
let myChart;
let timer;
let startTime;
let option = reactive({ value: {} });
window.addEventListener("resize", () => {
  myChart.resize();
});
onMounted(() => {
  myChart = echarts.init(document.getElementById("scoreCountingChart"));
  option.value = echartOption;
  myChart.setOption(option.value);
  //开始处理定时修改地下的位置
  startTime = dayjs().valueOf();
  timer = requestAnimationFrame(movePosition);
});
const movePosition = () => {
  if (dayjs().valueOf() - startTime > 4000) {
    startTime = dayjs().valueOf();
    const startEnd = mapTimeLoop[option.value.dataZoom[0].start]; //返回一个数组，代表这次需要赋什么值
    option.value.dataZoom[0].start = startEnd[0];
    option.value.dataZoom[0].end = startEnd[1];
    myChart.setOption(option.value);
  }
  timer = requestAnimationFrame(movePosition);
};
onBeforeUnmount(() => {
  cancelAnimationFrame(timer);
  timer = null;
});
</script>
<style lang="less" scoped></style>
