<template>
  <div class="reviewManagement-container h-full">
    <component :is="renderMap[renderName]" v-model:renderName="renderName"></component>
  </div>
</template>
<script setup>
import { ref } from "vue";
import AuditList from "@/components/reviewManagement/auditList.vue";
import ReviewList from "@/components/reviewManagement/reviewList.vue";
const renderName = ref("AuditList");
const renderMap = {
  AuditList: AuditList,
  ReviewList: ReviewList,
};
</script>
<style lang="less" scoped>
.reviewManagement-container {
  display: flex;
  flex-direction: column;
}
</style>
