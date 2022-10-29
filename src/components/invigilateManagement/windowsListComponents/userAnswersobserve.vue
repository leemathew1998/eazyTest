<template>
  <BasicCard>
    <template #title> 用户答题情况 </template>
    <template #mainContent>
      <div id="scoreCountingChart" class="h-full w-full"></div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
let myChart;
let option;
window.addEventListener("resize", () => {
  myChart.resize();
});
onMounted(() => {
  myChart = echarts.init(document.getElementById("scoreCountingChart"));
  option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ["product", "2012", "2013", "2014", "2015"],
        ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
        ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
        ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
      ],
    },
    xAxis: [
      { type: "category", gridIndex: 0 },
      { type: "category", gridIndex: 1 },
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    grid: [{ bottom: "55%" }, { top: "55%" }],
    series: [
      // These series are in the second grid.
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    ],
  };

  option && myChart.setOption(option);
});
</script>
<style lang="less" scoped></style>
