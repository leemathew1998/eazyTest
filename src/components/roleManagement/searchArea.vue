<template>
  <BasicCardVue>
    <template #title>角色查询</template>
    <template #mainContent>
      <el-form :model="form" :inline="true" ref="ruleFormRef" class="searchArea-form">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename" placeholder="请输入角色名称" />
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
import emiter from "@/utils/mitt.js";
import BasicCardVue from "@/components/basicCard.vue";
const form = reactive({
  rolename: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("role-search", form);
};
const onSubmit = () => {
  emiter.emit("role-search", form);
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
.searchArea-form {
  display: flex;
  flex-wrap: wrap;
  // justify-content: flex-end;
}
</style>
