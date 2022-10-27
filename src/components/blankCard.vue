<template>
  <div class="basic-card w-full h-full p-2">
    <div class="p-2 h-full overflow-auto">
      <slot name="mainContent"></slot>
    </div>
  </div>
</template>
<script setup></script>
<style lang="less" scoped>
.basic-card {
  background-color: #fff;
  border-width: 0px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  -moz-box-shadow: 0px 2px 8px rgba(3, 43, 36, 0.0666666666666667);
  -webkit-box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
  box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
}
</style>
