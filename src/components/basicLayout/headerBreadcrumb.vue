<template>
  <div class="headerBreadcrumb-container p-4">
    <div class="breadcrumb flex items-center justify-start p-2">
      <img src="@/assets/image/u1190.svg" class="w-4" alt="" />
      <el-divider direction="vertical" />
      <div class="flex items-center justify-start">
        <div
          v-for="item in editableTabs"
          :key="item.name"
          class="flex items-center tab-item mr-3"
        >
          <span class="tab-item-name">{{ item.title }}</span>
          <el-icon class="ml-2"><Close /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
let tabIndex = 2;
const editableTabsValue = ref("2");
const editableTabs = ref([
  {
    title: "非业务功能",
    name: "1",
  },
  {
    title: "在线考试系统",
    name: "2",
  },
]);
</script>
<style lang="less" scoped>
.headerBreadcrumb-container {
  background-color: #f4f4f4;
  .breadcrumb {
    background-color: #fff;
    border-width: 0px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    -moz-box-shadow: 0px 2px 8px rgba(3, 43, 36, 0.0666666666666667);
    -webkit-box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
    box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
  }
  .tab-item {
    background-color: rgba(240, 240, 240, 1);
    border-radius: 6px;
    box-shadow: none;
    font-family: "SourceHanSansCN-Normal", "Source Han Sans CN Normal",
      "Source Han Sans CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    text-align: left;
    align-self: center;
    padding: 4px 8px 4px 16px;
    box-sizing: border-box;
  }
}
/deep/.el-divider--vertical {
  height: 1.2em;
}
</style>
