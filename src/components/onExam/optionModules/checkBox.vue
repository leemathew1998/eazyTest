<template>
  <el-checkbox-group v-model="checkList" class="flex flex-col items-start">
    <el-checkbox label="Option A" />
    <el-checkbox label="Option B" />
    <el-checkbox label="Option C" />
    <el-checkbox label="Option D" />
    <el-checkbox label="Option E" />
    <el-checkbox label="Option F" />
  </el-checkbox-group>
</template>
<script setup>
import { ref } from "vue";
const checkList = ref([]);
</script>
<style lang="less" scoped>
/deep/.is-checked {
  .el-checkbox__inner {
    border-color: #31969a;
    background: #31969a;
  }
  .el-checkbox__label {
    color: #31969a;
  }
}
</style>
