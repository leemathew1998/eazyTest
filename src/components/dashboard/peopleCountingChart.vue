<template>
  <BasicCard>
    <template #title> 考试人数类型分布图 </template>
    <template #mainContent>
      <div id="peopleCountingChart" class="h-full w-full"></div>
    </template>
  </BasicCard>
  <div></div>
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
  myChart = echarts.init(document.getElementById("peopleCountingChart"));
  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "40",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "前端" },
          { value: 735, name: "测试" },
          { value: 580, name: "后端" },
          { value: 484, name: "设计" },
        ],
      },
    ],
  };
  option && myChart.setOption(option);
});
</script>
<style lang="less" scoped></style>
