<template>
  <div class="carousel-container">
    <el-carousel
      class="w-full h-full"
      style="padding: 10px 20px 0 0"
      trigger="click"
      indicator-position="none"
      always="never"
      :autoplay="false"
      @change="carouselChange"
      ref="carouselRef"
    >
      <el-carousel-item class="w-full h-full">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="carouselRules"
          label-width="200px"
          class="demo-ruleForm"
          size="default"
          status-icon
        >
          <el-form-item
            class="flex justify-center"
            style="margin-bottom: 1rem"
            label="JavaScript运行函数名称"
            prop="JavaScriptFunName"
          >
            <el-input v-model="ruleForm.JavaScriptFunName" placeholder="请输入JavaScript运行函数名称" />
          </el-form-item>
          <el-form-item
            class="flex justify-center"
            style="margin-bottom: 1rem"
            label="Java运行函数名称"
            prop="JavaFunName"
          >
            <el-input v-model="ruleForm.JavaFunName" placeholder="请输入Java运行函数名称" />
          </el-form-item>
          <el-form-item
            class="flex justify-center"
            style="margin-bottom: 1rem"
            label="输入参数(多个以‘,’分割)"
            prop="InputParams"
          >
            <el-input
              v-model="ruleForm.InputParams"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="示例:nums:number[],target:number"
            />
          </el-form-item>
          <el-form-item
            class="flex justify-center"
            style="margin-bottom: 1rem"
            label="输出参数类型(多个以‘,’分割)"
            prop="OutputParams"
          >
            <el-input
              v-model="ruleForm.OutputParams"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="示例:number[],number"
            />
          </el-form-item>
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
const emits = defineEmits();
const ruleForm = reactive({
  JavaScriptFunName: "",
  JavaFunName: "",
  InputParams: "",
  OutputParams: "",
});
//处理carousel点击切换功能
const carouselRef = ref();
const carouselChange = async (a) => {
  if (a === 1) {
    //从0到1
    await ruleFormRef.value.validate((valid, fields) => {
      if (!valid) {
        carouselRef.value.setActiveItem(0);
      }
    });
    emits("renderCodeArea", ruleForm);
  }
};
</script>
<style lang="less" scoped>
.carousel-container {
  width: 100%;
  :deep(.el-input__wrapper) {
    width: 15rem !important;
  }
  :deep(.el-textarea__inner) {
    width: 13.5rem !important;
  }
}
</style>
