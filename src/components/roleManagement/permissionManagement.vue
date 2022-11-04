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
      node-key="label"
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
const getCheckedNodes = () => {
  console.log();
};
const handleNodeClick = (data) => {
  if (data.hasOwnProperty("children")) {
    //如果选择了data中的某一项，就得把其中的查询权限加上。
    const allCheckedNodes = treeRef.value.getCheckedNodes(false, false); //[...]
    const result = data.children.find((thisItem) => {
      const abc = allCheckedNodes.find((checkedNode) => {
        return checkedNode.label === thisItem.label;
      });
      return abc ? true : false;
    });
    console.log(`allCheckedNodes,result`, allCheckedNodes, result);
    if (result) {
      treeRef.value.setCheckedNodes([data.children[0], ...allCheckedNodes], false);
    } else {
      // 没找到
    }
  }
};
const treeRef = ref();

const defaultProps = {
  children: "children",
  label: "label",
};
// form数据
const submitForm = async () => {};
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
