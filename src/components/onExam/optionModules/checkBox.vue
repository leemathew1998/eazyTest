<template>
  <el-checkbox-group :disabled="props.disable" v-model="examStore.answers['多选'][props.innerIndex].answer" class="flex flex-col items-start">
    <el-checkbox label="A">{{ props.record.ta }}</el-checkbox>
    <el-checkbox label="B">{{ props.record.tb }}</el-checkbox>
    <el-checkbox label="C">{{ props.record.tc }}</el-checkbox>
    <el-checkbox label="D">{{ props.record.td }}</el-checkbox>
    <el-checkbox label="E">{{ props.record.te }}</el-checkbox>
    <el-checkbox label="F">{{ props.record.tf }}</el-checkbox>
  </el-checkbox-group>
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
