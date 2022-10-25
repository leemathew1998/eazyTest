<template>
  <div class="reviewManagement-container h-full">
    <AuditList></AuditList>
  </div>
</template>
<script setup>
import AuditList from "@/components/reviewManagement/auditList.vue";
</script>
<style lang="less" scoped>
.reviewManagement-container {
  display: flex;
  flex-direction: column;
}
</style>
