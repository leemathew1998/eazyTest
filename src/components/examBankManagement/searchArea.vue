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
        <el-form-item label="题目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="单选题" />
            <el-option label="多选题" value="多选题" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目难度" prop="level">
          <el-select v-model="form.level" placeholder="请选择题目难度">
            <el-option label="简单" value="简单" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识分类" prop="class">
          <el-select v-model="form.class" placeholder="请选择知识分类">
            <el-option label="应用开发" value="应用开发" />
            <el-option label="算法" value="算法" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入试卷名称" />
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
  type: "",
  level: "",
  class: "",
  name: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("exam-search", form);
};
const onSubmit = () => {
  emiter.emit("exam-search", form);
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.searchArea-form {
  display: flex;
  flex-wrap: wrap;
}
</style>
