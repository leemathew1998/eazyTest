<template>
  <el-input
    v-model="examStore.answers['简答'][props.innerIndex].answer"
    :rows="5"
    :disabled="props.disable"
    maxlength="200"
    show-word-limit
    type="textarea"
    placeholder="请输入答案"
    class="pl-px mt-2"
  />
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
:deep(.el-textarea__inner) {
  width: 100% !important;
}
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
