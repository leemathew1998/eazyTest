<template>
  <div class="manualRender-container">
    <div class="left">
      <LeftTopSearchArea></LeftTopSearchArea>
      <LeftBottomListArea style="flex: 1; margin-top: 0.5rem"></LeftBottomListArea>
    </div>
    <div class="right ml-2">
      <PreviewPaperVue></PreviewPaperVue>
    </div>
  </div>
</template>
<script setup>
import LeftTopSearchArea from "@/components/examBankManagement/manualRender/leftTopSearchArea.vue";
import LeftBottomListArea from "@/components/examBankManagement/manualRender/leftBottomListArea.vue";
import PreviewPaperVue from "@/components/examBankManagement/manualRender/previewPaper.vue";
import { useExamStore } from "@/store";
const examStore = useExamStore();
examStore.$reset();
/*
 *@Author: jkwei
 *@Date: 2022-10-31 10:56:49
 *@Description: 现在的想法是存到examStore中，现在examStore肯定是空的
 */
</script>
<style lang="less" scoped>
.manualRender-container {
  display: flex;
  min-height: 100%;
  max-height: 120%;
  width: 100%;
  margin-top: 1rem;
  .left,
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
