<template>
  <el-radio-group v-model="radio" class="flex flex-col items-start">
    <el-radio label="A">正确</el-radio>
    <el-radio label="B">错误</el-radio>
  </el-radio-group>
</template>
<script setup>
import { ref } from "vue";
const radio = ref("");
</script>
<style lang="less" scoped>
/deep/.is-checked {
  .el-radio__label {
    color: #31969a;
  }
  .el-radio__inner {
    border-color: #31969a;
    background: #31969a;
  }
}
</style>
