<script setup>
import { onMounted } from "vue";
import Obs from "@/components/obs.vue";
onMounted(() => {
  document.body.style.setProperty("--el-menu-active-color", "#32969A");
  document.body.style.setProperty("--el-menu-hover-text-color", "#32969A");
});
</script>

<template>
  <!-- <Obs></Obs> -->
  <router-view></router-view>
</template>

<style lang="less"></style>
