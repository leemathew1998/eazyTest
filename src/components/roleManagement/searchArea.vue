<template>
  <BasicCardVue>
    <template #title>角色查询</template>
    <template #mainContent>
      <el-form
        :model="form"
        :inline="true"
        ref="ruleFormRef"
        class="searchArea-form"
      >
        <el-form-item label="权限名称" prop="username">
          <el-input v-model="form.rolename" placeholder="请输入权限名称" />
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
const form = reactive({
  rolename: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
const onSubmit = () => {};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.searchArea-form {
  display: flex;
  flex-wrap: wrap;
  // justify-content: flex-end;
}
</style>
