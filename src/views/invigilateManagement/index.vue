<template>
  <BlankCardWithOutBorder>
    <template #title>
      <el-menu
        :default-active="activeIndex"
        class="top-menu"
        mode="horizontal"
        :ellipsis="false"
        @select="activeIndex = 'MonitorList'"
      >
        <el-menu-item index="MonitorList">在线考试列表</el-menu-item>
        <el-menu-item index="WindowsList" disabled>监考页面</el-menu-item>
      </el-menu>
    </template>
    <template #mainContent>
      <component :is="renderMap[activeIndex]" v-model:renderComponentName="activeIndex"></component>
    </template>
  </BlankCardWithOutBorder>
</template>
<script setup>
import BlankCardWithOutBorder from "@/components/blankCardWithOutBorder.vue";
import MonitorList from "@/components/invigilateManagement/monitorList.vue";
import WindowsList from "@/components/invigilateManagement/windowsList.vue";
import { ref } from "vue";
const renderMap = {
  MonitorList: MonitorList,
  WindowsList: WindowsList,
};
const activeIndex = ref("MonitorList");
</script>
<style lang="less" scoped>
.top-menu {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
/deep/.el-menu--horizontal {
  border-bottom: 0px;
}
</style>
