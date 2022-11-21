<template>
  <BasicCard>
    <template #title> 考试人数类型分布图 </template>
    <template #mainContent>
      <div v-loading="loading" id="peopleCountingChart" :style="{'marginTop':MT}" class="h-full w-full"></div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { leftChart } from "./options.js";
import { getCount } from "@/api/dashborad.js";
let myChart;
let option = leftChart;
window.addEventListener("resize", () => {
  myChart.resize();
});
const getData = async () => {
  const res = await getCount();
  if (res.code === 200 && res.success) {
    option.series[0].data[0].value = res.data.front;
    option.series[0].data[1].value = res.data.test;
    option.series[0].data[2].value = res.data.after;
    option.series[0].data[3].value = res.data.design;
  }
};
const loading = ref(false);
const MT = ref('0rem');
//由于需要div的margin-top: -2rem，但是会影响loading，所以需要调整style
onMounted(async () => {
  loading.value = true;
  await getData();
  myChart = echarts.init(document.getElementById("peopleCountingChart"));
  option && myChart.setOption(option);
  MT.value = '-2rem';
  loading.value = false;
});
</script>
<style lang="less" scoped></style>
