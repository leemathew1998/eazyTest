<template>
  <BasicCard>
    <template #title> 异常情况报告 </template>
    <template #mainContent>
      <div class="count-down-container">
       123456
      </div>
    </template>
  </BasicCard>
  <div></div>
</template>
<script setup>
import BasicCard from "./basicCard.vue";
import { renderTimeFormat } from "@/components/onExam/methods.js";
import { onMounted, ref } from "vue";
</script>
<style lang="less" scoped>

</style>
