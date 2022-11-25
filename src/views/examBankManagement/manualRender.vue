<template>
  <div class="manualRender-container">
    <div class="left">
      <div>
        <LeftTopSearchArea></LeftTopSearchArea>
      </div>
      <div class="mt-2" style="flex: 1">
        <LeftBottomListArea></LeftBottomListArea>
      </div>
    </div>
    <div class="right">
      <PreviewPaperVue></PreviewPaperVue>
    </div>
  </div>
</template>
<script setup>
import LeftTopSearchArea from "@/components/examBankManagement/manualRender/leftTopSearchArea.vue";
import LeftBottomListArea from "@/components/examBankManagement/manualRender/leftBottomListArea.vue";
import PreviewPaperVue from "@/components/examBankManagement/manualRender/previewPaper.vue";
</script>
<style lang="less" scoped>
.manualRender-container {
  min-width: 780px;
  display: flex;
  margin-top: 1rem;
  height: 98%;
  .left {
    flex: 2;
    display: flex;
    flex-direction: column;
  }
  .right {
    flex: 1;
    display: flex;
    margin-left: 0.5rem;
    flex-direction: column;
  }
}
</style>
