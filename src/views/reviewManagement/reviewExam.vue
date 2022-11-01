<template>
  <div class="flex flex-col h-full">
    <div class="mt-4">
      <Header returnPath="/reviewManagement"></Header>
    </div>
    <div class="main flex mt-2">
      <ReviewAnswer></ReviewAnswer>
    </div>
  </div>
</template>
<script setup>
import Header from "@/components/onExam/header.vue";
import ReviewAnswer from "@/components/reviewManagement/reviewAnswer.vue";
</script>
<style lang="less" scoped>
.main {
  flex: 1;
}
</style>
