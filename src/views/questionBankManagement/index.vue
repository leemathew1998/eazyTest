<template>
  <div class="userManagement-container h-full">
    <SearchArea class="SearchArea mb-2"></SearchArea>
    <QuestionList class="UserList"></QuestionList>
  </div>
</template>
<script setup>
import SearchArea from "@/components/questionBankManagement/searchArea.vue";
import QuestionList from "@/components/questionBankManagement/questionList.vue";
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
