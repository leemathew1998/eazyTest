<template>
  <el-dialog v-model="props.toggleExamModal" title="新增考试" width="50%">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="ruleForm.examName" placeholder="请输入考试名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试类型" prop="examType">
            <el-select v-model="ruleForm.examType" placeholder="请输入考试类型">
              <el-option label="普通在线考试" value="普通在线考试" />
              <el-option label="集中在线考试" value="集中在线考试" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="及格分数" prop="examPassScore">
            <el-input v-model.number="ruleForm.examPassScore" type="text" placeholder="请输入及格分数" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试人员" prop="examCrews">
            <el-select v-model="ruleForm.examCrews" placeholder="请选择考试人员" multiple collapse-tags>
              <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试时长" prop="examTime">
            <el-input v-model="ruleForm.examTime" placeholder="请输入考试时长">
              <template #append>分钟</template>
            </el-input>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="20" justify="center">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试时间" prop="examTimeRange">
            <el-date-picker
              v-model="ruleForm.examTimeRange"
              type="datetimerange"
              format="MM/DD hh:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { rules, options } from "./constants.js";
// 状态参数
const props = defineProps({
  toggleExamModal: Boolean,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("update:toggleExamModal", false);
};
//页面信息
const ruleFormRef = ref();
const ruleForm = reactive({
  examName: "",
  examType: "",
  examTime: "",
  examTimeRange: [],
  examPassScore: "",
  examCrews: [],
});
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl) => {};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
/deep/.el-input--default {
  width: 100% !important;
}
/deep/.el-select--default {
  width: 100% !important;
}
/deep/.el-range__icon{
  display: none;
}
</style>
