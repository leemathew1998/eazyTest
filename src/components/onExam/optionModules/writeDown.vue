<template>
  <el-input
    v-model="examStore.answers['简答'][realCount].answer"
    :rows="5"
    maxlength="200"
    show-word-limit
    type="textarea"
    placeholder="请输入答案"
  />
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
    Object.keys(examStore.answers["多选"]).length -
    Object.keys(examStore.answers["判断"]).length
  );
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
