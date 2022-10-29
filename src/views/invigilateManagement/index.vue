<template>
  <BlankCardWithOutBorder>
    <template #title>
      <el-menu
        :default-active="activeIndex"
        class="top-menu"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="MonitorList">在线考试列表</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1">监考页面</el-menu-item>
      </el-menu>
    </template>
    <template #mainContent> <component :is="renderMap[activeIndex]"></component> </template>
  </BlankCardWithOutBorder>
</template>
<script setup>
import BlankCardWithOutBorder from "@/components/blankCardWithOutBorder.vue";
import MonitorList from "@/components/invigilateManagement/monitorList.vue";
import { ref } from "vue";
const renderMap = {
  MonitorList: MonitorList,
};
const activeIndex = ref("MonitorList");
const handleSelect = (key) => {
  console.log(key);
};
</script>
<style lang="less" scoped>
.top-menu {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
