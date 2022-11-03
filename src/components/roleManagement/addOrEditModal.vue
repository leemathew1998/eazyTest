<template>
  <el-dialog
    v-model="props.showUserModal"
    :title="props.userRecord ? '修改用户信息' : '新增用户'"
    width="50%"
    @closed="closeModal(ruleFormRef)"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="密码" prop="password">
            <el-input :type="passwordInputSuffixIcon" v-model="ruleForm.password" placeholder="请输入密码">
              <template #suffix>
                <el-icon @click="passwordInputSuffixIcon = 'text'" v-if="passwordInputSuffixIcon === 'password'"
                  ><View
                /></el-icon>
                <el-icon @click="passwordInputSuffixIcon = 'password'" v-else><Hide /></el-icon>
              </template>
            </el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" v-if="props.userRecord" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="创建人" prop="createdBy">
            <el-input v-model="ruleForm.createdBy" placeholder="创建人" disabled> </el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="组别" prop="group">
            <el-select v-model="ruleForm.group" placeholder="请选择组别">
              <el-option label="应用组" value="应用组" />
              <el-option label="存储组" value="存储组" />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" :offset="0">
          <el-form-item label="角色" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择角色">
              <el-option label="管理员" value="管理员" />
              <el-option label="出题人" value="出题人" />
              <el-option label="用户" value="用户" />
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
  userRecord: Object,
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
    // console.log(props.userRecord,ruleFormRef.value.resetFields());
    if (newVal && props.userRecord) {
      ruleForm.username = props.userRecord.username;
      ruleForm.type = props.userRecord.role;
      ruleForm.createdBy = props.userRecord.createdBy;
    } else {
      // 不知道为什么一直没有办法重置？
      ruleForm.username = "";
      ruleForm.type = "";
      ruleForm.createdBy = "";
      ruleForm.role = "";
    }
  },
);
// form数据
const passwordInputSuffixIcon = ref("password");
const ruleFormRef = ref();
const ruleForm = reactive({
  username: "",
  password: "",
  createdBy: "",
  group: "",
  phone: "",
  role: "",
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
