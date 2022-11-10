<template>
  <el-radio-group v-model="examStore.answers['单选'][props.innerIndex].answer" class="flex flex-col items-start">
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
});
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
