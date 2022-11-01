<template>
  <el-container  class="w-full h-full el-container">
    <el-header>
      <HeaderLayoutVue></HeaderLayoutVue>
    </el-header>
    <el-container class="pb-4">
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import HeaderLayoutVue from "./headerLayout.vue";
</script>
<style lang="less" scoped>
.el-container {
  min-height: 100%;
  max-height: 120%;
}
/deep/.el-header {
  padding: 0px;
}
/deep/.el-container {
  background-color: #f4f4f4;
  overflow-y: hidden;
}
/deep/.el-main {
  overflow: hidden;
  padding: 0 16px;
}
</style>
