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
        <el-menu-item index="pageOne">成绩查询</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="pageTwo">考试查询</el-menu-item>
      </el-menu>
    </template>
    <template #mainContent> <component :is="renderMap[activeIndex]"></component> </template>
  </BlankCardWithOutBorder>
</template>
<script setup>
import ExamScoreList from "@/components/scoreManagement/examScoreList.vue";
import pageOne from "@/components/scoreManagement/pageOne.vue";
import pageTwo from "@/components/scoreManagement/pageTwo.vue";
import BlankCardWithOutBorder from "@/components/blankCardWithOutBorder.vue";
import { ref } from "vue";
const renderMap = {
  pageTwo: pageTwo,
  pageOne: pageOne,
};
const activeIndex = ref("pageOne");
const handleSelect = (key) => {
  activeIndex.value = key;
};
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
