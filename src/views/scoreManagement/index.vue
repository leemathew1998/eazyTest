<template>
  <div class="reviewManagement-container h-full">
    <ExamScoreList></ExamScoreList>
  </div>
</template>
<script setup>
import ExamScoreList from "@/components/scoreManagement/examScoreList.vue";
</script>
<style lang="less" scoped>
.reviewManagement-container {
  display: flex;
  flex-direction: column;
}
</style>
