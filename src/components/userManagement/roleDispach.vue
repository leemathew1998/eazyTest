<template>
  <div v-loading="loading">
    <el-dialog v-model="props.roleContrlModal" title="修改角色" width="40%" @closed="closeModal(ruleFormRef)">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
        <el-row :gutter="20">
          <el-col :span="20" :offset="0">
            <el-form-item label="角色" prop="role">
              <el-select v-model="ruleForm.role" placeholder="请选择角色">
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
      </el-form>
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="closeModal(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { useUserStore } from "@/store";
import { assignRoleToUser } from "@/api/userManagement.js";
import { getList } from "@/api/roleManagement.js";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
// 状态参数
const props = defineProps({
  roleContrlModal: Boolean,
  userRecord: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("update:roleContrlModal", false);
};
//
watch(
  () => props.roleContrlModal,
  (newVal) => {
    if (newVal) {
      loadList();
    }
  },
);
const loading = ref(false);
const roleList = reactive({
  value: [],
});
const loadList = async () => {
  loading.value = true;
  const res = await getList({
    pageNo: 1,
    pageSize: 10000,
    userId: userStore.userId,
  });
  if (res.code === 200) {
    roleList.value = res.data.records;
  }
  loading.value = false;
};
// form数据
const ruleFormRef = ref();
const ruleForm = reactive({
  role: "",
});
const rules = reactive({
  role: [
    {
      required: true,
      message: "请选择角色",
      trigger: "blur",
    },
  ],
});
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const payload = {
        userId: userStore.userId,
        roleIds: [ruleForm.role],
      };
      let res = await assignRoleToUser(payload);
      if (res.code === 200) {
        emit("reLoadData", true);
        ElMessage.success("分配成功！");
        closeModal(ruleFormRef.value);
      } else {
        ElMessage.error("分配失败！");
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
