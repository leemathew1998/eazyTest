<template>
  <el-checkbox-group v-model="examStore.answers['多选'][props.typeCount].answer" class="flex flex-col items-start">
    <el-checkbox label="Option B" />
    <el-checkbox label="Option B" />
    <el-checkbox label="Option C" />
    <el-checkbox label="Option D" />
    <el-checkbox label="Option E" />
    <el-checkbox label="Option F" />
  </el-checkbox-group>
</template>
<script setup>
import { useExamStore } from "@/store";
const examStore = useExamStore();
const props = defineProps({
  typeCount: String | Number,
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
