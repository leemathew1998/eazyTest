<template>
  <BasicCard>
    <template #title> 考试人数类型分布图 </template>
    <template #mainContent>
      <div id="peopleCountingChart" style="margin-top: -2rem;" class="h-full w-full"></div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { leftChart } from "./options.js";
let myChart;
let option = leftChart;
window.addEventListener("resize", () => {
  myChart.resize();
});
onMounted(() => {
  myChart = echarts.init(document.getElementById("peopleCountingChart"));
  option && myChart.setOption(option);
});
</script>
<style lang="less" scoped>
</style>
