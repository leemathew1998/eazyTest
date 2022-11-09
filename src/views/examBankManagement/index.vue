<template>
  <div class="examManagement-container h-full">
    <SearchArea class="SearchArea mb-2"></SearchArea>
    <ExamList class="ExamList"></ExamList>
  </div>
</template>
<script setup>
import SearchArea from "@/components/examBankManagement/searchArea.vue";
import ExamList from "@/components/examBankManagement/examList.vue";
</script>
<style lang="less" scoped>
.examManagement-container {
  display: flex;
  flex-direction: column;
  .SearchArea{
    flex: 1;
  }
  .ExamList{
    flex: 8;
  }
}
</style>
