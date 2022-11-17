<template>
  <div class="carousel-container">
    <el-carousel
      class="w-full h-full"
      style="padding: 10px 20px 0 0"
      trigger="click"
      indicator-position="none"
      always="never"
      :autoplay="false"
    >
      <el-carousel-item class="w-full h-full">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="carouselRules"
          label-width="220px"
          class="demo-ruleForm"
          size="default"
          status-icon
        >
          <el-form-item class="flex justify-center mb-4" label="JavaScript语言运行函数名称" prop="JavaScriptFunName">
            <el-input v-model="ruleForm.JavaScriptFunName" placeholder="请输入JavaScript语言运行函数名称"/>
          </el-form-item>
          <el-form-item class="flex justify-center mb-4" label="Java语言运行函数名称" prop="JavaFunName">
            <el-input v-model="ruleForm.JavaFunName" placeholder="请输入Java语言运行函数名称"/>
          </el-form-item>
          <!-- <el-form-item label="Activity zone" prop="region">
            <el-select v-model="ruleForm.region" placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item> -->
        </el-form>
      </el-carousel-item>
      <el-carousel-item class="w-full h-full"> 5678 </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { carouselRules } from "./constants.js";
const ruleFormRef = ref();
const ruleForm = reactive({
  JavaScriptFunName: "",
  JavaFunName: "",
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

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style lang="less" scoped>
.carousel-container {
  width: 100%;
}
</style>
