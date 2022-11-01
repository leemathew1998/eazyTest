<template>
  <BasicCard>
    <template #title> 成绩人数分布图 </template>
    <template #mainContent>
      <div id="scoreCountingChart" class="h-full w-full"></div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { rightChart } from "./options.js";
let myChart;
let option = rightChart;
window.addEventListener("resize", () => {
  myChart.resize();
});
onMounted(() => {
  myChart = echarts.init(document.getElementById("scoreCountingChart"));
  option && myChart.setOption(option);
});
</script>
<style lang="less" scoped></style>
