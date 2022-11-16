<template>
  <el-empty :image-size="200" description="进入未知领域">
    <el-button type="primary" @click="rediractToLogin">返回</el-button>
  </el-empty>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const rediractToLogin = () => {
  router.push("/login");
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
</style>
