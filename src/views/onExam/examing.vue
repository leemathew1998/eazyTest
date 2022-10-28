<template>
  <div class="flex flex-col">
    <div class="mt-4">
      <Header></Header>
    </div>
    <div class="flex mt-2">
      <div class="left">
        <CategoryModule></CategoryModule>
      </div>
      <div class="main ml-2 mr-2">
        <AnswerArea></AnswerArea>
      </div>
      <div class="right">
        <PersonModule></PersonModule>
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from "@/components/onExam/header.vue";
import AnswerArea from "@/components/onExam/answerArea.vue";
import CategoryModule from "@/components/onExam/categoryModule.vue";
import PersonModule from "@/components/onExam/personModule.vue";

</script>
<style lang="less" scoped>
.left,
.right {
  flex: 2;
}
.main {
  flex: 6;
}
</style>
