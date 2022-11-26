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
          <el-form-item class="flex justify-center" style="margin-bottom: 1rem" label="输出参数类型" prop="OutputParams">
            <el-input v-model="ruleForm.OutputParams" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
              placeholder="示例:number[]" />
          </el-form-item>
        </el-form>
        <el-button class="absolute bottom-0 right-4 animated" type="primary" size="default" ref="buttonRef"
          @click="submitForm">下一步</el-button>
      </el-carousel-item>
      <!-- 第二页 -->
      <el-carousel-item class="w-full h-full relative">
        <el-form label-width="100px" class="demo-ruleForm" size="default" status-icon
          v-for="(paramName, index) in sortCodeParamsList()" :key="paramName">

          <el-form-item class="flex justify-center" style="margin-bottom: 0.5rem" :label="paramName.split('__')[0]">
            <el-input v-model="examStore.codeParamsList[paramName][formLength]"
              :placeholder="`${paramName.includes('__InPut') ? '输入参数' : '输出参数'}`" />
          </el-form-item>

        </el-form>
        <!-- 右上角弹出框开始 -->
        <el-popover :width="300" trigger="click" placement="bottom-end">
          <template #reference>
            <div class="topRightBadge">共计{{ formLength }}组参数</div>
          </template>
          <el-table :data="renderTableData.tableData">
            <el-table-column v-for="row in renderTableData.loopList" :key="row.property" :property="row.property"
              :label="row.label" />
            <el-table-column property="action" label="操作" align="center">
              <template #default="scope">
                <el-button class="pr-4" @click="handleDelete(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-popover>
        <!-- 右上角弹出框结束 -->
        <el-button class="absolute bottom-0" type="primary" size="default" @click="() => carouselRef.setActiveItem(0)">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>上一步
        </el-button>
        <el-button class="absolute bottom-0 right-0 " type="primary" size="default" @click="nextPach">下一个</el-button>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
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
    examStore.codeParamsList["javaScriptFunName"] = props.record.javaScriptFunName;
    ruleForm.JavaFunName = "not_support_java";
    delete props.record.javaScriptFunName;
    delete props.record.Java;
    delete props.record.JavaScript;
    //循环参数
    Object.keys(props.record).forEach((key) => {
      examStore.codeParamsList[key] = [];
      if (key.includes("__InPut")) {
        ruleForm.InputParams += key.split("__InPut")[0] + ",";
      } else {
        ruleForm.OutputParams += key.split("__OutPut")[0] + ",";
      }
      props.record[key].forEach((item) => {
        examStore.codeParamsList[key].push(item);
      });
    });
    handlerParams();
  }
  formLength.value = Object.values(examStore.codeParamsList).find(item => Array.isArray(item))?.length || 0
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
const formLength = ref(0)
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
      examStore.codeParamsList["javaScriptFunName"] = ruleForm.JavaScriptFunName;
      carouselRef.value.setActiveItem(1);
      sortCodeParamsList();
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
    if (!examStore.codeParamsList.hasOwnProperty(`${param}__InPut`)) {
      examStore.codeParamsList[`${param}__InPut`] = [];
    }
    InputParams.push(param.split(":")[0]);
    JSCode += `* @param ${param} \n`;
  });

  ruleForm.OutputParams.split(",").forEach((param) => {
    if (!examStore.codeParamsList.hasOwnProperty(`${param}__OutPut`)) {
      examStore.codeParamsList[`${param}__OutPut`] = [];
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
  formLength.value = Object.values(examStore.codeParamsList).find(item => Array.isArray(item))?.length || 0
  // examStore.codeParamsList = Form2;
};
//匹配table数据，让他能够修改删除参数！
const renderTableData = computed(() => {
  let tableData = []
  let loopList = []
  Object.keys(examStore.codeParamsList).forEach((key) => {
    if (key !== 'javaScriptFunName') {
      const paramName = key.split("__")[0]
      loopList.push({
        'label': paramName,
        'property': paramName,
      })
    }
  });
  Object.values(examStore.codeParamsList).filter(item => Array.isArray(item)).forEach((item, outerIndex) => {
    if (Array.isArray(item)) {
      item.forEach((innerItem, innerIndex) => {
        if (!tableData[innerIndex]) {
          tableData[innerIndex] = {}
        }
        tableData[innerIndex][loopList[outerIndex].property] = innerItem
      })
    }
  })
  return { tableData, loopList }
})
const handleDelete = (index) => {
  Object.keys(examStore.codeParamsList).forEach((key) => {
    if (Array.isArray(examStore.codeParamsList[key])) {
      examStore.codeParamsList[key].splice(index, 1)
    }
  })
  formLength.value = Object.values(examStore.codeParamsList).find(item => Array.isArray(item))?.length || 0
}
const sortCodeParamsList = () => {
  return Object.keys(examStore.codeParamsList).filter(item => item !== 'javaScriptFunName').sort((prev, next) => {
    return prev.split('__')[1].localeCompare(next.split('__')[1])
  })
}
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

:deep(.el-scrollbar__view) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}
</style>
