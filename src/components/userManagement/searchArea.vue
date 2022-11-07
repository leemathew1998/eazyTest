<template>
  <BasicCardVue>
    <template #title>用户查询</template>
    <template #mainContent>
      <el-form
        :model="form"
        :inline="true"
        ref="ruleFormRef"
        class="searchArea-form"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="组别" prop="class">
          <el-select v-model="form.class" placeholder="请选择所属组别">
            <el-option label="应用组" value="应用组" />
            <el-option label="存储组" value="存储组" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择所属角色">
            <el-option label="管理员" value="管理员" />
            <el-option label="用户" value="用户" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import emiter from "@/utils/mitt.js";
const form = reactive({
  username: "",
  class: "",
  role: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("user-search", form);
};
const onSubmit = () => {
  emiter.emit("user-search", form);
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.searchArea-form {
  display: flex;
  flex-wrap: wrap;
  // justify-content: flex-end;
}
</style>
