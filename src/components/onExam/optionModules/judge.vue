<template>
  <el-radio-group v-model="examStore.answers['判断'][realCount].answer" class="flex flex-col items-start">
    <el-radio label="A">正确</el-radio>
    <el-radio label="B">错误</el-radio>
  </el-radio-group>
</template>
<script setup>
import { computed } from "vue";
import { useExamStore } from "@/store";
const examStore = useExamStore();
const props = defineProps({
  record: Object,
});
const realCount = computed(() => {
  // 很无奈，主页面的count是递增的，store里面是按类别分的
  return (
    props.record.count -
    1 -
    Object.keys(examStore.answers["单选"]).length -
    Object.keys(examStore.answers["多选"]).length
  );
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
