<template>
  <el-radio-group v-model="radio" class="flex flex-col items-start">
    <el-radio label="A">Option A</el-radio>
    <el-radio label="B">Option B</el-radio>
    <el-radio label="C">Option C</el-radio>
    <el-radio label="D">Option D</el-radio>
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
