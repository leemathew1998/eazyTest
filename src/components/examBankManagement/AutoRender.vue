<template>
  <div class="flex" v-loading="loading">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="demo-ruleForm"
      size="default"
      v-if="props.fatherUtils.status !== 2"
    >
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="试卷名称" prop="examName">
            <el-input v-model="ruleForm.examName" placeholder="请输入试卷名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="总分" prop="totalScore">
            <el-input placeholder="请输入总分" type="number" v-model="ruleForm.totalScore">
              <template #append>分</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="题型" prop="quesTypes">
            <el-select multiple placeholder="请选择题型" v-model="ruleForm.quesTypes">
              <el-option label="单选题" value="单选题" />
              <el-option label="多选题" value="多选题" />
              <el-option label="简答题" value="简答题" />
              <el-option label="判断题" value="判断题" />
              <el-option label="编程题" value="编程题" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select multiple placeholder="请选择分类" v-model="ruleForm.class" class="specialWidth">
              <el-option label="开发相关" value="开发相关" />
              <el-option label="算法题" value="算法题" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="题量" prop="count">
        <el-slider v-model="ruleForm.count" />
      </el-form-item>
      <el-form-item label="难度系数" prop="level">
        <el-slider v-model="ruleForm.level" :format-tooltip="formatTooltip" />
      </el-form-item>
    </el-form>
    <div
      class="right flex flex-col w-full pl-4 pr-4 items-center justify-between"
      v-if="props.fatherUtils.status === 2"
    >
      <img src="@/assets/image/u727.svg" alt="" class="w-1/3 cursor-pointer" />
      <div class="flex cursor-pointer items-center" @click="previewPaper">
        <el-icon style="color: #31969a"><View /></el-icon>
        <span style="color: #31969a">试卷预览</span>
      </div>
      <span class="reRender">
        不满意？
        <a @click="backTorenderPaper">重新生成！</a>
      </span>
    </div>
    <PreviewPaperVue v-model:togglePreviewPaper="togglePreviewPaper"></PreviewPaperVue>
  </div>
</template>
<script setup>
import { ref, watch, reactive } from "vue";
import PreviewPaperVue from "./previewPaper.vue";
import { useExamStore } from "@/store";
import { loopToFillState } from "@/utils/methods.js";
import { rules } from "./methods.js";
// 初始化store，我们把考生答案放在pinia中！
const examStore = useExamStore();
const props = defineProps({
  autoRenderForm: Object,
  fatherUtils: Object,
});
const loading = ref(false);
watch(
  () => props.fatherUtils,
  async (newVal) => {
    if (newVal.footerTitle === "确定" && newVal.status === 1) {
      await ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
          console.log("submit!");
          props.fatherUtils.status = 2;
          renderPaper();
        } else {
          // 验证失败，直接返回上一步
          props.fatherUtils.status = 0;
          props.fatherUtils.footerTitle = "生成试卷";
        }
      });
    }
  },
  { deep: true },
);

// 页面相关
const ruleFormRef = ref();
const ruleForm = reactive({
  examName: "",
  count: 0,
  level: 0,
  totalScore: 0,
  quesTypes: [],
  class: [],
});

const formatTooltip = (val) => {
  return val / 100;
};
const renderPaper = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
const togglePreviewPaper = ref(false);
const previewPaper = () => {
  loading.value = true;
  // 假设现在都是20道题目
  loopToFillState(examStore, { 单选: 20, 多选: 20, 简答: 20, 判断: 20, 编程: 20 });
  togglePreviewPaper.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>

<style lang="less" scoped>
@import url("@/assets/css/common.less");
/deep/.el-input-group {
  width: 14rem;
}
/deep/.el-select {
  width: 15.375rem;
}
/deep/.el-input {
  width: 15.375rem;
}
/deep/.el-slider {
  width: 15.375rem;
}
.left {
  flex: 4;
}
.right {
  flex: 2;
}
.reRender {
  font-size: 12px;
  color: #31969a;
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
.specialWidth {
  width: 15.375rem;
  /deep/ .select-trigger {
    width: 15.375rem;
    .el-input {
      width: 15.375rem;
    }
  }
}
</style>
