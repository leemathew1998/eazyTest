<template>
  <BlankCard>
    <template #title>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="0">LOGO</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1">Processing Center</el-menu-item>
      </el-menu>
    </template>
  </BlankCard>
</template>
<script setup>
import BlankCard from "@/components/blankCard.vue";
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>
<style lang="less" scoped>
.left,
.right {
  flex: 2;
}
.main {
  flex: 6;
}
</style>
