<template>
  <BasicCardVue>
    <template #title>题库查询</template>
    <template #mainContent>
      <el-form
        :model="form"
        :inline="true"
        ref="ruleFormRef"
        class="searchArea-form"
      >
        <el-form-item label="题目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题目类型">
            <el-option label="单选题" value="1" />
            <el-option label="多选题" value="2" />
            <el-option label="判断题" value="3" />
            <el-option label="简答题" value="4" />
            <el-option label="编程题" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目难度" prop="level">
          <el-select v-model="form.level" placeholder="请选择题目难度">
            <el-option label="简单" value="1" />
            <el-option label="中等" value="2" />
            <el-option label="困难" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识分类" prop="class">
          <el-select v-model="form.class" placeholder="请选择知识分类">
            <el-option label="前端" value="1" />
            <el-option label="后端" value="2" />
            <el-option label="设计" value="3" />
            <el-option label="测试" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入题目内容" />
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
  content: "",
});
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("question-search", form);
};
const onSubmit = () => {
  emiter.emit("question-search", form);
};
const ruleFormRef = ref();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.searchArea-form {
  display: flex;
  flex-wrap: wrap;
}
</style>
