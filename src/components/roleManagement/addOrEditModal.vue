<template>
  <el-dialog
    v-model="props.showUserModal"
    :title="props.userRecord ? '修改角色信息' : '新增角色'"
    width="50%"
    @closed="closeModal(ruleFormRef)"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="角色名称" prop="rolename">
            <el-input v-model="ruleForm.rolename" placeholder="请输入角色名称" /> </el-form-item
        ></el-col>
        <el-col :span="12" :offset="0" class="-ml-4">
          <el-form-item label="描述" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入角色描述" /> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { modalRules } from "./constants.js";
import { addRole, updateRole } from "@/api/roleManagement.js";
import { ElMessageBox } from "element-plus";
// 状态参数
const props = defineProps({
  showUserModal: Boolean,
  roleRecord: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  formEl.resetFields();
  emit("update:showUserModal", false);
  emit("update:roleRecord", {});
};
// form数据
const ruleFormRef = ref();
const ruleForm = reactive({
  rolename: "",
  description: "",
  roleList: [],
});
const rules = reactive(modalRules);
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const payload = {};
      let res;
      if (Object.keys(props.roleRecord).length > 0) {
        res = await updateRole(payload);
      } else {
        res = await addRole(payload);
      }
      if (res.code === 200) {
        ElMessageBox.success("新建成功！");
        closeModal(ruleFormRef.value);
      } else {
        ElMessageBox.error("新建失败！");
      }
    }
  });
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
