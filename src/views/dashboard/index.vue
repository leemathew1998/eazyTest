<template>
  <div class="dashboard-container h-full">
    <SearchAreaVue></SearchAreaVue>
    
    <!-- <MonitorList class="MonitorList"></MonitorList>
    <LoginList class="LoginList ml-4"></LoginList> -->
  </div>
</template>
<script setup>
import SearchAreaVue from "@/components/dashboard/searchArea.vue";
import MonitorList from "@/components/dashboard/monitorList.vue";
import LoginList from "@/components/dashboard/loginList.vue";
</script>
<style lang="less" scoped>
.dashboard-container {
  display: flex;
  .MonitorList {
    flex: 5;
  }
  .LoginList {
    flex: 2;
  }
}
</style>
