<template>
  <BlankCard>
    <template #mainContent>
      <el-form
        :model="form"
        :inline="true"
        ref="ruleFormRef"
        class="searchArea-form"
      >
        <el-form-item label="日期选择" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item style="margin-right: 0px;">
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
const form = reactive({
  dateRange: "",
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
  justify-content: space-between;
  align-items: center;
}
:deep(.el-form-item__content){
  justify-content: flex-end;
}
</style>
