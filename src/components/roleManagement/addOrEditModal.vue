<template>
  <el-dialog
    v-model="props.showUserModal"
    :title="props.userRecord ? '修改角色信息' : '新增角色'"
    width="50%"
    @closed="closeModal(ruleFormRef)"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="角色名称" prop="rolename">
            <el-input v-model="ruleForm.rolename" placeholder="请输入角色名称" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="权限列表" prop="roleList">
            <el-select v-model="ruleForm.roleList" multiple collapse-tags placeholder="请选择权限">
              <el-option label="用户管理" value="用户管理" />
              <el-option label="题库管理" value="题库管理" />
              <el-option label="试卷管理" value="试卷管理" />
              <el-option label="阅卷管理" value="阅卷管理" />
              <el-option label="监考管理" value="监考管理" />
            </el-select> </el-form-item
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
import { ref, reactive, watch } from "vue";
import { modalRules } from "./constants.js";
// 状态参数
const props = defineProps({
  showUserModal: Boolean,
  roleRecord: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  formEl.resetFields();
  emit("update:showUserModal", false);
  emit("update:userRecord", {});
};
watch(
  () => props.showUserModal,
  (newVal) => {
    // console.log(props.roleRecord,ruleFormRef.value.resetFields());
  },
);
// form数据
const ruleFormRef = ref();
const ruleForm = reactive({
  rolename: "",
  roleList: [],
});
const rules = reactive(modalRules);
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      closeModal(ruleFormRef.value);
    } else {
      console.log("error submit!", fields);
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
