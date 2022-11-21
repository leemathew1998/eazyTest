<template>
  <el-dialog v-model="props.showUserModal" :title="title" width="30%" @closed="closeModal(ruleFormRef)">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="modalRules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
      v-loading="formLoading"
    >
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" :disabled="props.userRecordReadOnly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4" v-if="title === '新增用户'">
        <el-col :span="20" :offset="0">
          <el-form-item label="密码" prop="password">
            <el-input
              :type="passwordInputSuffixIcon"
              v-model="ruleForm.password"
              placeholder="请输入密码"
              :disabled="props.userRecordReadOnly"
            >
              <!-- 本来是可以显示原密码的，但是后端不同意。 -->
              <template #suffix>
                <el-icon @click="passwordInputSuffixIcon = 'text'" v-if="passwordInputSuffixIcon === 'password'">
                  <View />
                </el-icon>
                <el-icon @click="passwordInputSuffixIcon = 'password'" v-else>
                  <Hide />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="props.userRecord" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="创建人" prop="createBy">
            <el-input v-model="ruleForm.createBy" placeholder="创建人" disabled> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="组别" prop="group">
            <el-select v-model="ruleForm.group" :disabled="props.userRecordReadOnly" placeholder="请选择组别">
              <el-option label="应用组" value="应用组" />
              <el-option label="存储组" value="存储组" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="20" :offset="0">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="ruleForm.phone" :disabled="props.userRecordReadOnly" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4" v-if="userStore.menuLicenses['用户管理'].includes('分配权限')">
        <el-col :span="20" :offset="0">
          <el-form-item label="角色" prop="role">
            <el-select v-model="ruleForm.role" placeholder="请选择角色" :disabled="props.userRecordReadOnly">
              <el-option
                :label="item.roleName"
                :value="item.roleId"
                v-for="item in roleList.value"
                :key="item.roleId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 重置密码区域，只有在更新的时候会出现 -->
      <el-row :gutter="20" class="mb-4" v-if="showPasswordInput">
        <el-col :span="20" :offset="0">
          <el-form-item label="密码" prop="password">
            <el-input
              :type="passwordInputSuffixIcon"
              v-model="ruleForm.password"
              placeholder="请输入密码"
              :disabled="props.userRecordReadOnly"
            >
              <!-- 本来是可以显示原密码的，但是后端不同意。 -->
              <template #suffix>
                <el-icon @click="passwordInputSuffixIcon = 'text'" v-if="passwordInputSuffixIcon === 'password'">
                  <View />
                </el-icon>
                <el-icon @click="passwordInputSuffixIcon = 'password'" v-else>
                  <Hide />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="resetPassword(ruleFormRef)" v-if="title === '修改用户信息'">重置密码</el-button>
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button
          v-if="!props.userRecordReadOnly"
          :loading="loading"
          ref="buttonRef"
          class="animated"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, watch, computed, nextTick } from "vue";
import {
  modalRules,
  passwordInputSuffixIcon,
  ruleFormRef,
  ruleForm,
  showPasswordInput,
  resetPassword,
  loadRoleList,
  roleList,
  getOneUser,
  formLoading,
} from "./constants.js";
import { ElMessage } from "element-plus";
import { addUser, updateUser } from "@/api/userManagement.js";
import { useUserStore } from "@/store";
import { CryptojsSet } from "@/views/login/methods.js";
import dayjs from "dayjs";
const userStore = useUserStore();
// 状态参数
const props = defineProps({
  showUserModal: Boolean,
  userRecord: Object,
  userRecordReadOnly: Boolean,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  emit("update:showUserModal", false);
  formEl.resetFields();
  emit("update:userRecord", {});
  showPasswordInput.value = false;
};

watch(
  () => props.showUserModal,
  (newVal) => {
    if (newVal && props.userRecord) {
      nextTick(() => {
        // 此处为修改，需要把密码
        ruleForm.username = props.userRecord.username;
        ruleForm.createBy = props.userRecord.createBy;
        ruleForm.group = props.userRecord.theGroup;
        ruleForm.phone = props.userRecord.phone;
        ruleForm.role = props.userRecord.roleId;
        ruleForm.password = "";
      });
      loadRoleList(userStore.userId);
      //需要加载角色列表
    } else if (newVal) {
      loadRoleList(userStore.userId);
    }
  },
);
//最上面的title
const title = computed(() => {
  if (props.userRecordReadOnly) {
    return "查看信息";
  } else if (props.userRecord) {
    return "修改用户信息";
  } else {
    return "新增用户";
  }
});
// form数据
const loading = ref(false);
const buttonRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      let payload = {
        username: ruleForm.username,
        theGroup: ruleForm.group,
        phone: ruleForm.phone,
      };
      let res;
      if (props.userRecord) {
        //修改
        payload = {
          ...payload,
          updateBy: userStore.username,
          updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          userId: props.userRecord.userId,
        };
        if (showPasswordInput.value) {
          payload = {
            ...payload,
            password: CryptojsSet(ruleForm.password),
          };
        }
        res = await updateUser(payload);
      } else {
        //新增
        payload = {
          ...payload,
          password: ruleForm.password,
          createBy: userStore.username,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        res = await addUser(payload);
      }
      //开始处理权限部分
      if (userStore.menuLicenses["用户管理"].includes("分配权限")) {
        //有权限,但是需要自己再查询出来USERId,然后再分配权限
        const updateRole = await getOneUser({
          username: ruleForm.username,
          phone: ruleForm.phone,
          roleIds: [ruleForm.role],
        });
        if (updateRole.code === 200 && updateRole.success) {
          ElMessage.success("分配权限成功");
        } else {
          ElMessage.error("分配权限失败");
        }
      }
      if (res.code === 200) {
        ElMessage.success(props.userRecord ? "用户修改成功！" : "用户新建成功！");
      } else {
        ElMessage.error(props.userRecord ? "用户修改失败！" : "用户新建失败！");
      }
      emit("reLoadData", true);
      closeModal(ruleFormRef.value);
      loading.value = false;
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
  });
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/animate.css");
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
