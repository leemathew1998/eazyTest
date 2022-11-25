<template>
  <div class="carousel-container">
    <el-carousel class="w-full h-full" style="padding: 10px 20px 0 0" trigger="click" indicator-position="none"
      always="never" arrow="never" :autoplay="false" ref="carouselRef">
      <el-carousel-item class="w-full h-full relative">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="carouselRules" label-width="200px" class="demo-ruleForm"
          size="default" status-icon>
          <el-form-item class="flex justify-center" style="margin-bottom: 1rem" label="JavaScript运行函数名称"
            prop="JavaScriptFunName">
            <el-input v-model="ruleForm.JavaScriptFunName" placeholder="请输入JavaScript运行函数名称" />
          </el-form-item>
          <el-form-item class="flex justify-center" style="margin-bottom: 1rem" label="Java运行函数名称" prop="JavaFunName">
            <el-input v-model="ruleForm.JavaFunName" placeholder="请输入Java运行函数名称" />
          </el-form-item>
          <el-form-item class="flex justify-center" style="margin-bottom: 1rem" label="输入参数(多个以‘,’分割)"
            prop="InputParams">
            <el-input v-model="ruleForm.InputParams" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
              placeholder="示例:nums:number[],target:number" />
          </el-form-item>
          <el-form-item class="flex justify-center" style="margin-bottom: 1rem" label="输出参数类型(多个以‘,’分割)"
            prop="OutputParams">
            <el-input v-model="ruleForm.OutputParams" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
              placeholder="示例:number[],number" />
          </el-form-item>
        </el-form>
        <el-button class="absolute bottom-0 right-4 animated" type="primary" size="default" ref="buttonRef"
          @click="submitForm">下一步</el-button>
      </el-carousel-item>
      <!-- 第二页 -->
      <el-carousel-item class="w-full h-full relative">
        <el-form label-width="120px" class="demo-ruleForm" size="default" status-icon
          v-for="(params, type) in formLength">
          <div>{{ type === "Input" ? "输入参数" : "输出参数" }}</div>
          <el-form-item v-for="param in params" class="flex justify-center" style="margin-bottom: 0.5rem"
            :label="param.split('__')[0]">
            <el-input v-model="Form2[param][Form2Index]" placeholder="请输入参数" />
          </el-form-item>
        </el-form>
        <el-popover :width="300" trigger="click" placement="bottom-end">
          <template #reference>
            <div class="topRightBadge">共计{{ Form2Index }}组参数</div>
          </template>
          <div v-for="(list, type) of Form2" :key="type">
            <div v-if="Array.isArray(list)">
              <!-- inner loop -->
              <el-row :gutter="20">
                <el-col :span="10" :offset="0" class="whitespace-nowrap">{{ type.split("__")[0] }}:</el-col>
                <el-col :span="14" :offset="0">{{ list.join(",") }}</el-col>
              </el-row>
            </div>
          </div>
        </el-popover>

        <el-button class="absolute bottom-0 right-0 " type="primary" size="default" @click="nextPach">下一个</el-button>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { carouselRules } from "./constants.js";
import { useExamStore } from "@/store";
const examStore = useExamStore();
const emits = defineEmits();
const props = defineProps({
  record: Object,
});
onMounted(() => {
  if (Object.keys(props.record).length > 0) {
    //修改部分
    ruleForm.JavaScriptFunName = props.record.javaScriptFunName;
    ruleForm.JavaFunName = "not_support_java";
    delete props.record.javaScriptFunName;
    delete props.record.Java;
    delete props.record.JavaScript;
    //循环参数
    Object.keys(props.record).forEach((key) => {
      if (key.includes("__InPut")) {
        ruleForm.InputParams += key.split("__InPut")[0] + ",";
      } else {
        ruleForm.OutputParams += key.split("__OutPut")[0] + ",";
      }
    });
    ruleForm.InputParams = ruleForm.InputParams.slice(0, -1);
    ruleForm.OutputParams = ruleForm.OutputParams.slice(0, -1);
    handlerParams();
    Object.keys(props.record).forEach((key) => {
      Form2[key] = props.record[key];
    });
    Form2Index.value = Object.values(Form2)[0].length;
    examStore.codeParamsList = Form2;
  }
});
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
const buttonRef = ref();
const submitForm = async () => {
  //从0到1
  await ruleFormRef.value.validate((valid, fields) => {
    if (!valid) {
      carouselRef.value.setActiveItem(0);
      if (buttonRef.value.ref.className.indexOf("shake") > -1) {
        const classs = buttonRef.value.ref.className
          .split(" ")
          .filter((item) => item != "shake")
          .join(" ");
        buttonRef.value.ref.className = classs;
      }
      setTimeout(() => {
        buttonRef.value.ref.className += " shake";
      }, 0);
      return;
    } else {
      handlerParams();
      carouselRef.value.setActiveItem(1);
    }
  });
};
const handlerParams = () => {
  //处理最后有 ，的情况
  if (ruleForm.InputParams[ruleForm.InputParams.length - 1] === ",") {
    ruleForm.InputParams = ruleForm.InputParams.slice(0, -1);
  }
  if (ruleForm.OutputParams[ruleForm.OutputParams.length - 1] === ",") {
    ruleForm.OutputParams = ruleForm.OutputParams.slice(0, -1);
  }
  //处理参数
  let JSCode = `/** \n`;
  let InputParams = [];

  ruleForm.InputParams.split(",").forEach((param) => {
    if (!Form2.hasOwnProperty(`${param}__InPut`)) {
      Form2[`${param}__InPut`] = [];
      formLength.value["Input"].push(`${param}__InPut`);
    }
    InputParams.push(param.split(":")[0]);
    JSCode += `* @param ${param} \n`;
  });

  ruleForm.OutputParams.split(",").forEach((param) => {
    if (!Form2.hasOwnProperty(`${param}__OutPut`)) {
      Form2[`${param}__OutPut`] = [];
      formLength.value["Output"].push(`${param}__OutPut`);
    }
    JSCode += `* @return ${param} \n`;
  });
  JSCode += "*/ \n";

  JSCode += `
var ${ruleForm.JavaScriptFunName} = function(${InputParams.join(",")}){
  
}
        `;
  const JavaCode = `class Solution {
public int[] twoSum(int[] nums, int target) {

  }
}
      `;
  emits("renderCodeArea", {
    JavaScript: JSCode,
    Java: JavaCode,
  });
};
const nextPach = () => {
  Form2Index.value = Object.values(Form2)[0].length;
  examStore.codeParamsList = Form2;
  examStore.codeParamsList["javaScriptFunName"] = ruleForm.JavaScriptFunName;
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
    cursor: pointer;
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
