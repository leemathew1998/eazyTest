<template>
  <el-radio-group
    :disabled="props.disable"
    v-model="examStore.answers['判断'][props.innerIndex].answer"
    class="flex flex-col items-start"
  >
    <el-radio label="1">正确</el-radio>
    <el-radio label="0">错误</el-radio>
  </el-radio-group>
</template>
<script setup>
import { useExamStore } from "@/store";
const examStore = useExamStore();
const props = defineProps({
  innerIndex: String | Number,
  record: Object,
  disable: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="less" scoped>
:deep(.el-radio) {
  margin-right: 32px;
}
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
