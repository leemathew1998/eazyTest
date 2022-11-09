<script setup>
import { onMounted } from "vue";
//设置初始值
if (!localStorage.getItem("userInfo")) {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      username: "",
      password: "",
      token: "",
      userId: "",
      roleId: "",
      menuLicenses: [],
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
//设置一些主颜色
onMounted(() => {
  document.body.style.setProperty("--el-menu-active-color", "#32969A");
  document.body.style.setProperty("--el-menu-hover-text-color", "#32969A");
  document.body.style.setProperty("--el-button-bg-color", "#32969A");
  document.body.style.setProperty("--el-color-primary", "#32969A");
  document.body.style.setProperty("--el-button-hover-bg-color", "#32969A");
  document.body.style.setProperty("--el-color-primary-light-3", "#32969A");
});
</script>

<template>
  <Suspense>
    <router-view />
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<style lang="less"></style>
