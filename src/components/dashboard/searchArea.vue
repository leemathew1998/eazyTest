<template>
  <BlankCard>
    <template #mainContent>
      <el-form :model="form" :inline="true" ref="ruleFormRef" class="searchArea-form">
        <el-form-item label="日期选择" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item style="margin-right: 0px">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </BlankCard>
</template>
<script setup>
import { reactive, ref } from "vue";
import BlankCard from "@/components/blankCard.vue";
import dayjs from "dayjs";
//默认最近七天
const form = reactive({
  dateRange: [dayjs().subtract(7, "days").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")],
});
const ruleFormRef = ref();
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
const onSubmit = () => {
  console.log(form);
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
/deep/.el-form-item {
  margin: 4px;
  width: 20rem;
  .el-form-item__content {
    width: 20rem;
    .el-input__wrapper {
      width: 18rem;
    }
  }
}
.searchArea-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-form-item__content) {
  justify-content: flex-end;
}
</style>
