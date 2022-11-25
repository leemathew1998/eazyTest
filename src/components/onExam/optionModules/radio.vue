<template>
  <el-radio-group
    :disabled="props.disable"
    v-model="examStore.answers['单选'][props.innerIndex].answer"
    class="w-full flex flex-col pl-px"
    style="align-items: flex-start;"
  >
    <el-radio label="A">{{ props.record.ta }}</el-radio>
    <el-radio label="B">{{ props.record.tb }}</el-radio>
    <el-radio label="C">{{ props.record.tc }}</el-radio>
    <el-radio label="D">{{ props.record.td }}</el-radio>
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
