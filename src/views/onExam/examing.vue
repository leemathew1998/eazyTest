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
import { useExamStore } from "@/store";
import { loopToFillState } from "@/utils/methods.js";
// 初始化store，我们把考生答案放在pinia中！
const examStore = useExamStore();
// 假设现在都是20道题目
loopToFillState(examStore, { 单选: 20, 多选: 20, 简答: 20, 判断: 20, 编程: 20 });
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
