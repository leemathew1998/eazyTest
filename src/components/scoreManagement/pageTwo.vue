<template>
  <div class="pageTwo-container h-full flex flex-col">
    <div>
      <examSelectVue></examSelectVue>
    </div>
    <div style="flex: 1" class="mt-2">
      <examScoreListVue></examScoreListVue>
    </div>
  </div>
</template>
<script setup>
import examSelectVue from "./examSelect.vue";
import examScoreListVue from "./examScoreList.vue";
</script>
<style lang="less" scoped></style>
