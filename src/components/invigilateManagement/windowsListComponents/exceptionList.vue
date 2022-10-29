<template>
  <BasicCard>
    <template #title> 考试剩余时间 </template>
    <template #mainContent>
      <div class="count-down-container">
        {{ renderTimeFormat }}
      </div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import { renderTimeFormat } from "@/components/onExam/methods.js";
import { onMounted, ref } from "vue";
</script>
<style lang="less" scoped>
.count-down-container {
  display: flex;
  justify-content: center;
  border-width: 0px;
  background-color: rgba(240, 240, 240, 1);
  border: none;
  border-radius: 115px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 20px;
  color: #fa1f1f;
}
</style>
