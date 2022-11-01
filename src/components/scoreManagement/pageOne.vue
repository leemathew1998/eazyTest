<template>
  <div class="pageOne-container h-full flex flex-col">
    <div>
      <scoreSelectVue></scoreSelectVue>
    </div>
    <div style="flex:1" class="mt-2">
      <scoreListVue></scoreListVue>
    </div>
  </div>
</template>
<script setup>
import scoreSelectVue from "./scoreSelect.vue";
import scoreListVue from "./scoreList.vue";
</script>
<style lang="less" scoped></style>
