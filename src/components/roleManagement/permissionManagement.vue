<template>
  <el-dialog
    v-model="props.showPermissionModal"
    :title="props.userRecord ? '修改权限信息' : '新增权限'"
    width="50%"
    @closed="closeModal(ruleFormRef)"
  >
    <el-tree
      :data="treeData"
      ref="treeRef"
      :props="defaultProps"
      node-key="id"
      accordion
      show-checkbox
      @check-change="handleNodeClick"
    />
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { treeData } from "./constants.js";
// 状态参数
const props = defineProps({
  showPermissionModal: Boolean,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:showPermissionModal", false);
};
// 处理树状全线
const collectTreeNode = {};
const getCheckedNodes = () => {
  console.log(treeRef.value.getCheckedNodes(false, false));
};
const getCheckedKeys = () => {
  console.log(treeRef.value.getCheckedKeys(false));
};
const handleNodeClick = (data) => {
  getCheckedNodes();
  console.log(data);
};
const treeRef = ref();

const defaultProps = {
  children: "children",
  label: "label",
};
// form数据
const submitForm = async () => {

};
</script>
<style lang="less" scoped>
/deep/.el-form-item__content {
  width: 16rem !important;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-input__validateIcon {
  display: none;
}
</style>
