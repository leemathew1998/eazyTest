<template>
  <div class="examSelect-container">
    <BlankCard>
      <template #mainContent>
        <el-form :model="form" :inline="true" ref="ruleFormRef" class="searchArea-form">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="form.examName" placeholder="请输入考试名称" />
          </el-form-item>
          <el-form-item label="试卷类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择试卷类型">
              <el-option label="简单" value="简单" />
              <el-option label="困难" value="困难" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期选择" prop="timeRange">
            <el-date-picker
              v-model="form.timeRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
    </BlankCard>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import BlankCard from "@/components/blankCard.vue";
const form = reactive({
  examName: "",
  type: "",
  timeRange: "",
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
</style>
