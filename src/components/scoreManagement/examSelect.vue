<template>
  <div class="examSelect-container">
    <BlankCard>
      <template #mainContent>
        <el-form :model="form" :inline="true" ref="ruleFormRef" class="searchArea-form">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="form.examName" placeholder="请输入考试名称" />
          </el-form-item>
          <el-form-item label="考试状态" prop="markStatus">
            <el-select v-model="form.markStatus" placeholder="请选择考试状态">
              <el-option label="已阅卷" value="1" />
              <el-option label="未完成" value="2" />
              <el-option label="未阅卷" value="3" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="日期选择" prop="timeRange">
            <el-date-picker
              v-model="form.timeRange"
              type="daterange"
              format="MM月DD日"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item> -->
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
import emiter from "@/utils/mitt.js";
import BlankCard from "@/components/blankCard.vue";
const form = reactive({
  examName: "",
  markStatus: "",
  timeRange: "",
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emiter.emit("pageTwo-search", form);
};
const onSubmit = () => {
  emiter.emit("pageTwo-search", form);
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
</style>
