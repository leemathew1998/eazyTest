<template>
  <div class="manualRender-container">
    <TransitionGroup @enter="transitionEnter" @leave="transitionLeave">
      <div class="left">
        <div>
          <LeftTopSearchArea></LeftTopSearchArea>
        </div>
        <div class="mt-2" style="flex: 1">
          <LeftBottomListArea></LeftBottomListArea>
        </div>
      </div>
      <div class="right ml-2">
        <PreviewPaperVue></PreviewPaperVue>
      </div>
    </TransitionGroup>
  </div>
</template>
<script setup>
import LeftTopSearchArea from "@/components/examBankManagement/manualRender/leftTopSearchArea.vue";
import LeftBottomListArea from "@/components/examBankManagement/manualRender/leftBottomListArea.vue";
import PreviewPaperVue from "@/components/examBankManagement/manualRender/previewPaper.vue";
import { useExamStore } from "@/store";
import gsap from "gsap";
const examStore = useExamStore();
examStore.$reset();
const transitionEnter = (el) => {
  console.log("enter", el);
};
const transitionLeave = (el) => {
  console.log("leave", el);
};
/*
 *@Author: jkwei
 *@Date: 2022-10-31 10:56:49
 *@Description: 现在的想法是存到examStore中，现在examStore肯定是空的
 */
</script>
<style lang="less" scoped>
.manualRender-container {
  display: flex;
  margin-top: 1rem;
  height: 100%;
  .left {
    flex: 2;
    display: flex;
    flex-direction: column;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
