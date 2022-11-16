<template>
  <div class="scoreSelect-container">
    <BlankCard>
      <template #mainContent>
        <el-form :model="form" :inline="true" ref="ruleFormRef" class="searchArea-form">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="form.examName" placeholder="请输入考试名称" />
          </el-form-item>
          <el-form-item label="考生姓名" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入考生姓名" />
          </el-form-item>
          <el-form-item label="阅卷人" prop="reviewer">
            <el-input v-model="form.reviewer" placeholder="请输入阅卷人" />
          </el-form-item>
          <el-form-item label="是否参加" prop="isJoin">
            <el-select v-model="form.isJoin" placeholder="请选择参加状态">
              <el-option value="1" label="已参加" />
              <el-option value="2" label="未参加" />
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
import emiter from "@/utils/mitt.js";
const form = reactive({
  examName: "",
  userName: "",
  reviewer: "",
  isJoin: "",
  timeRange: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("scoreManage-search", form);
};
const onSubmit = () => {
  emiter.emit("scoreManage-search", form);
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
</style>
