<template>
  <el-container class="w-full h-full el-container">
    <el-header>
      <HeaderLayoutVue></HeaderLayoutVue>
    </el-header>
    <HeaderBreadcrumb></HeaderBreadcrumb>
    <el-container class="pb-4">
      <el-aside width="200px">
        <AsideLayoutVue></AsideLayoutVue>
      </el-aside>
      <el-main>
        <router-view #default="{ route, Component }">
          <Transition :enter-active-class="route.meta.transition">
            <component :is="Component"></component>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import HeaderBreadcrumb from "./headerBreadcrumb.vue";
import AsideLayoutVue from "./asideLayout.vue";
import HeaderLayoutVue from "./headerLayout.vue";
</script>
<style lang="less" scoped>
@import url("@/assets/css/animate.css");
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
