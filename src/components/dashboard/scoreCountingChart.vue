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
const getData = async () => {
  const res = await getScore();
  if (res.code === 200 && res.success) {
    const map = ["60分以下", "60-69分", "70-79分", "80-89分", "90分以上"];
    for (let index = 0; index < 5; index++) {
      option.dataset.source[index + 1] = [
        map[index],
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
