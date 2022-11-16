<script setup>
import { onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = ref(zhCn);
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
      routers: [],
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
  <el-config-provider :locale="locale">
    <Suspense>
      <router-view />
      <template #fallback> Loading... </template>
    </Suspense>
  </el-config-provider>
</template>

<style lang="less">
@import url("@/assets/css/common.less");
@import url("@/assets/css/animate.css");
</style>
