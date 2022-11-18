<template>
  <div class="carousel-container">
    <el-carousel
      class="w-full h-full"
      style="padding: 10px 20px 0 0"
      trigger="click"
      indicator-position="none"
      always="never"
      arrow="never"
      :autoplay="false"
      ref="carouselRef"
    >
      <el-carousel-item class="w-full h-full relative">
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
        <el-button class="absolute bottom-0 right-0" type="primary" size="default" @click="submitForm"
          >下一步</el-button
        >
      </el-carousel-item>
      <el-carousel-item class="w-full h-full relative">
        <el-form
          label-width="120px"
          class="demo-ruleForm"
          size="default"
          status-icon
          v-for="(params, type) in formLength"
        >
          <div>{{ type === "Input" ? "输入参数" : "输出参数" }}</div>
          <el-form-item
            v-for="param in params"
            class="flex justify-center"
            style="margin-bottom: 0.5rem"
            :label="param.split('__')[0]"
          >
            <el-input v-model="Form2[param][Form2Index]" placeholder="请输入参数" />
          </el-form-item>
        </el-form>
        <div class="topRightBadge">共计{{ Form2Index }}组参数</div>
        <el-button class="absolute bottom-0 right-0" type="primary" size="default" @click="nextPach">下一个</el-button>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { carouselRules } from "./constants.js";
import { useExamStore } from "@/store";
const examStore = useExamStore();
const emits = defineEmits();
//第一页数据
const ruleFormRef = ref();
const ruleForm = reactive({
  JavaScriptFunName: "",
  JavaFunName: "",
  InputParams: "",
  OutputParams: "",
});
//第二页数据
const formLength = ref({
  Input: [],
  Output: [],
});
const Form2 = reactive({});
const Form2Index = ref(0);
//处理carousel点击切换功能
const carouselRef = ref();
const submitForm = async () => {
  //从0到1
  await ruleFormRef.value.validate((valid, fields) => {
    if (!valid) {
      carouselRef.value.setActiveItem(0);
    } else {
      carouselRef.value.setActiveItem(1);
    }
  });
  if (formLength.value.Input.length === 0) {
    ruleForm.InputParams.split(",").forEach((param) => {
      Form2[`${param}__InPut`] = [];
      formLength.value["Input"].push(`${param}__InPut`);
    });
    ruleForm.OutputParams.split(",").forEach((param) => {
      Form2[`${param}__OutPut`] = [];
      formLength.value["Output"].push(`${param}__OutPut`);
    });
    emits("renderCodeArea", ruleForm);
  }
};

const nextPach = () => {
  Form2Index.value++;
  console.log(Form2)
  examStore.codeParamsList = Form2;
  examStore.codeParamsList['javaScriptFunName'] = ruleForm.JavaScriptFunName
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
  .topRightBadge {
    position: absolute;
    top: 0px;
    right: 0px;
    background-color: #999;
    border-radius: 20px;
    padding: 4px 8px;
    color: #fff;
  }
}
</style>
