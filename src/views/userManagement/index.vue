<template>
  <div class="userManagement-container h-full">
    <SearchArea class="SearchArea mb-2"></SearchArea>
    <UserList class="UserList"></UserList>
  </div>
</template>
<script setup>
import SearchArea from "@/components/userManagement/searchArea.vue";
import UserList from "@/components/userManagement/userList.vue";
</script>
<style lang="less" scoped>
.userManagement-container {
  display: flex;
  flex-direction: column;
  .SearchArea{
    flex: 1;

  }
  .UserList{
    flex: 8;
  }
}
</style>
