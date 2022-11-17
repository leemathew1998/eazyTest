<template>
  <BasicCard>
    <template #title> 成绩人数分布图 </template>
    <template #mainContent>
      <div v-loading="loading" id="scoreCountingChart" class="h-full w-full mt-4"></div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { rightChart } from "./options.js";
import { getScore } from "@/api/dashborad.js";
let myChart;
let option = rightChart;
window.addEventListener("resize", () => {
  myChart.resize();
});
/*
 *@Author: jkwei
 *@Date: 2022-11-17 10:13:03
 *@Description: 
 after
: 
(5) [0, 0, 0, 0, 0]
design
: 
(5) [0, 0, 0, 0, 0]
front
: 
(5) [0, 0, 0, 0, 0]
test
: 
(5) [0, 0, 0, 0, 0]
*/
const getData = async () => {
  const res = await getScore();
  if (res.code === 200 && res.success) {
    for (let index = 0; index < 5; index++) {
      option.dataset.source[index + 1] = [
        res.data.front[index],
        res.data.after[index],
        res.data.design[index],
        res.data.test[index],
      ];
    }
  }
};
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  await getData();
  myChart = echarts.init(document.getElementById("scoreCountingChart"));
  option && myChart.setOption(option);
  loading.value = false;
});
</script>
<style lang="less" scoped></style>
