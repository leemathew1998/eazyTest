<template>
  <div class="roleManagement-container h-full">
    <SearchArea class="SearchArea mb-2"></SearchArea>
    <RoleList class="RoleList"></RoleList>
  </div>
</template>
<script setup>
import SearchArea from "@/components/roleManagement/searchArea.vue";
import RoleList from "@/components/roleManagement/roleList.vue";
//请求数据
const loadData = async () => {

};
loadData();
</script>
<style lang="less" scoped>
.roleManagement-container {
  display: flex;
  flex-direction: column;
  .SearchArea {
    flex: 1;
  }
  .RoleList {
    flex: 8;
  }
}
</style>
