<template>
  <div class="manualRender-container">
    <div class="left">left</div>
    <div class="right">wert</div>
  </div>
</template>
<script setup></script>
<style lang="less" scoped>
.manualRender-container {
  display: flex;
  min-height: 100%;
  max-height: 120%;
  width: 100%;
  .left,
  .right {
    flex: 1;
  }
}
</style>
