<template>
  <div class="dashboard-container h-full">
    <SearchAreaVue></SearchAreaVue>
    <div class="flex mt-2 h-2/5">
      <div class="PeopleCountingChart">
        <PeopleCountingChart></PeopleCountingChart>
      </div>
      <div class="ml-2 ScoreCountingChart">
        <ScoreCountingChart class=""></ScoreCountingChart>
      </div>
    </div>
    <div class="mt-2" style="flex:1">
      <LoginList class="LoginList"></LoginList>
    </div>
  </div>
</template>
<script setup>
import SearchAreaVue from "@/components/dashboard/searchArea.vue";
import PeopleCountingChart from "@/components/dashboard/peopleCountingChart.vue";
import ScoreCountingChart from "@/components/dashboard/scoreCountingChart.vue";
import MonitorList from "@/components/dashboard/monitorList.vue";
import LoginList from "@/components/dashboard/loginList.vue";
</script>
<style lang="less" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  .PeopleCountingChart {
    flex: 2;
  }
  .ScoreCountingChart {
    flex: 3;
    margin-left: 0.5rem;
  }
}
</style>
