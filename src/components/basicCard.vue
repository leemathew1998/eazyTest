<template>
  <div class="basic-card w-full h-full p-2">
    <div class="title pb-2 sticky top-0 z-10">
      <p class="title-icon w-2 h-6 mr-2"></p>
      <span>
        <slot name="title"></slot>
      </span>
    </div>
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
  .title {
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 1px solid #EBEBEB;
    &-icon {
      background-color: rgba(49, 150, 154, 1);
      border-radius: 6px;
    }
  }
}
</style>
