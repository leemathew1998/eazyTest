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
      dimensions: ["product", "正在答题人数", "正确人数", "未答人数", "错误人数"],
      source: [
        ["product", "2012", "2013", "2014", "2015"],
        ["第一题", 41.1, 30.4, 65.1, 53.3],
        ["第二题", 86.5, 92.1, 85.7, 83.1],
        ["第三题", 86.5, 92.1, 85.7, 83.1],
        ["第四题", 86.5, 92.1, 85.7, 83.1],
        ["第五题", 86.5, 92.1, 85.7, 83.1],
      ],
    },
    xAxis: { type: "category" },
    yAxis: [
      {
        type: "value",
        name: "人数（个）",
      },
    ],
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: "bar",
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            barBorderRadius: [6, 6, 0, 0],
          },
        },
      },
      {
        type: "bar",
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            barBorderRadius: [6, 6, 0, 0],
          },
        },
      },
      {
        type: "bar",
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            barBorderRadius: [6, 6, 0, 0],
          },
        },
      },
      {
        type: "bar",
        itemStyle: {
          normal: {
            //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
            barBorderRadius: [6, 6, 0, 0],
          },
        },
      },
    ],
    color: ["#0091FF", "#45D6B6", "#F7B502", "#FA1E1F"],
  };

  option && myChart.setOption(option);
});
</script>
<style lang="less" scoped></style>
