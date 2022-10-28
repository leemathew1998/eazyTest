<template>
  <el-checkbox-group v-model="examStore.answers['多选'][realCount].answer" class="flex flex-col items-start">
    <el-checkbox label="Option A" />
    <el-checkbox label="Option B" />
    <el-checkbox label="Option C" />
    <el-checkbox label="Option D" />
    <el-checkbox label="Option E" />
    <el-checkbox label="Option F" />
  </el-checkbox-group>
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
  return props.record.count - 1 - Object.keys(examStore.answers["单选"]).length;
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
