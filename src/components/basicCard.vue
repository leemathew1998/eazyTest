<template>
  <div class="basic-card w-full h-full p-2 ">
    <template
      class="flex justify-between"
      style="border-bottom: 1px solid #ebebeb"
    >
      <div class="title pb-2 sticky top-0 z-10">
        <p class="title-icon w-2 h-6 mr-2"></p>
        <slot name="title"></slot>
      </div>
      <slot name="topRight"></slot>
    </template>

    <div class="p-2 h-full mainContent">
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
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &-icon {
      background-color: rgba(49, 150, 154, 1);
      border-radius: 6px;
    }
  }
}
</style>
