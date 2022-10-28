<template>
  <el-input
    v-model="textarea"
    :rows="5"
    maxlength="200"
    show-word-limit
    type="textarea"
    placeholder="请输入答案"
  />
</template>
<script setup>
import { ref } from "vue";
const textarea = ref("");
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
