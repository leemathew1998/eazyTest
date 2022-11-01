<template>
  <div class="basic-card w-full h-full">
    <template class="flex justify-between title-border" style="border-bottom: 1px solid #ebebeb">
      <div class="title sticky top-0 z-10 w-full">
        <slot name="title"></slot>
      </div>
    </template>
    <div style="flex: 1" class="p-2 mainContent">
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
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    &-icon {
      background-color: rgba(49, 150, 154, 1);
      border-radius: 6px;
    }
  }
}
</style>
