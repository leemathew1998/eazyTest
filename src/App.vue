<script setup>
import { onMounted } from "vue";
if (!localStorage.getItem("userInfo")) {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      username: "",
      password: "",
      token: "",
    }),
  );
}
if (!localStorage.getItem("deleteRoutes")) {
  localStorage.setItem(
    "deleteRoutes",
    JSON.stringify({
      deleteRoutes: [],
    }),
  );
}
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
  <router-view></router-view>
</template>

<style lang="less"></style>
