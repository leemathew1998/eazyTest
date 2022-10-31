<template>
  <el-dialog v-model="props.toggleExamModal" title="新增考试" width="50%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeModal">Cancel</el-button>
        <el-button type="primary" @click="closeModal"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
// 状态参数
const props = defineProps({
  toggleExamModal: Boolean,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:toggleExamModal", false);
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
