<template>
  <el-container class="h-full w-full">
    <el-header>
      <HeaderLayoutVue></HeaderLayoutVue>
    </el-header>
    <HeaderBreadcrumb></HeaderBreadcrumb>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import HeaderBreadcrumb from "./headerBreadcrumb.vue";
import asideLayoutVue from "./asideLayout.vue";
import mainLayoutVue from "./mainLayout.vue";
import HeaderLayoutVue from "./headerLayout.vue";
</script>
<style lang="less" scoped>
/deep/.el-header{
    padding: 0px;
}
/deep/.el-container{
    background-color: #f4f4f4;
}

</style>
