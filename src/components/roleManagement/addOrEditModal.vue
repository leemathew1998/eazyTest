<template>
  <el-dialog
    v-model="props.showUserModal"
    :title="props.roleRecord ? '修改角色信息' : '新增角色'"
    width="40%"
    @closed="closeModal(ruleFormRef)"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" status-icon>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="ruleForm.rolename" placeholder="请输入角色名称" :disabled="props.readOnly" />
        </el-form-item>
      </el-row>
      <el-row :gutter="20" justify="center">
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
            :disabled="props.readOnly"
          />
        </el-form-item>
      </el-row>

      <!-- 只读的话展示创建人等等... -->
      <el-row :gutter="20" class="mb-4" v-if="props.readOnly">
        <el-col :span="12" :offset="0">
          <el-form-item label="创建人" prop="createBy">
            <el-input v-model="ruleForm.createBy" placeholder="创建人" disabled /> </el-form-item
        ></el-col>
        <el-col :span="12" :offset="0" class="-ml-4">
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="ruleForm.createTime" placeholder="创建时间" disabled /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4" v-if="props.readOnly">
        <el-col :span="12" :offset="0">
          <el-form-item label="修改人" prop="updateBy">
            <el-input v-model="ruleForm.updateBy" placeholder="创建人" disabled /> </el-form-item
        ></el-col>
        <el-col :span="12" :offset="0" class="-ml-4">
          <el-form-item label="修改时间" prop="updateTime">
            <el-input v-model="ruleForm.updateTime" placeholder="创建时间" disabled /> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button
          :loading="loading"
          v-if="!props.readOnly"
          type="primary"
          ref="buttonRef"
          class="animated"
          @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { modalRules } from "./constants.js";
import { addRole, updateRole } from "@/api/roleManagement.js";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
import dayjs from "dayjs";
const userStore = useUserStore();
// 状态参数
const props = defineProps({
  showUserModal: Boolean,
  roleRecord: Object,
  readOnly: Boolean,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  emit("update:showUserModal", false);
  emit("update:roleRecord", {});
  nextTick(() => {
    formEl.resetFields();
  });
};
watch(
  () => props.showUserModal,
  (newVal) => {
    if (newVal && props.roleRecord) {
      ruleForm.rolename = props.roleRecord.roleName;
      ruleForm.description = props.roleRecord.description;
      ruleForm.createBy = props.roleRecord.createBy;
      ruleForm.createTime = props.roleRecord.createTime;
      ruleForm.updateBy = props.roleRecord.updateBy;
      ruleForm.updateTime = props.roleRecord.updateTime;
    } else {
      //   ruleFormRef.value.resetFields();
      // 不知道为什么一直没有办法重置？
      ruleForm.rolename = "";
      ruleForm.description = "";
    }
  },
);
// form数据
const ruleFormRef = ref();
const ruleForm = reactive({
  rolename: "",
  description: "",
});
const rules = reactive(modalRules);
const loading = ref(false);
const buttonRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      let payload = {
        roleName: ruleForm.rolename,
        description: ruleForm.description,
      };
      let res;
      if (props.roleRecord) {
        payload = {
          ...payload,
          roleId: props.roleRecord.roleId,
          updateBy: userStore.username,
          updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        res = await updateRole(payload);
      } else {
        payload = {
          ...payload,
          createBy: userStore.username,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        res = await addRole(payload);
      }
      if (res.code === 200) {
        ElMessage.success(props.roleRecord ? "修改成功" : "新建成功！");
        emit("reLoadData", true);
        closeModal(ruleFormRef.value);
      } else {
        ElMessage.error(props.roleRecord ? "修改失败！" : "新增失败");
      }
    } else {
      if (buttonRef.value.ref.className.indexOf("shake") > -1) {
        const classs = buttonRef.value.ref.className
          .split(" ")
          .filter((item) => item != "shake")
          .join(" ");
        buttonRef.value.ref.className = classs;
      }
      setTimeout(() => {
        buttonRef.value.ref.className += " shake";
      }, 0);
    }
    loading.value = false;
  });
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/animate.css");
/deep/.el-select {
  width: 100%;
}
/deep/.el-input__validateIcon {
  display: none;
}
</style>
