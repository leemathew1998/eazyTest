<script setup>
import { onMounted } from "vue";
import Obs from "@/components/obs.vue";
onMounted(() => {
  document.body.style.setProperty("--el-menu-active-color", "#32969A");
  document.body.style.setProperty("--el-menu-hover-text-color", "#32969A");
  document.body.style.setProperty("--el-button-bg-color", "#32969A");
  // document.body.style.setProperty("--el-button-border-color", "#32969A");
  document.body.style.setProperty("--el-color-primary", "#32969A");
  document.body.style.setProperty("--el-button-hover-bg-color", "#32969A");
  document.body.style.setProperty("--el-color-primary-light-3", "#32969A");
});
</script>

<template>
  <!-- <Obs></Obs> -->
  <router-view></router-view>
</template>

<style lang="less"></style>
