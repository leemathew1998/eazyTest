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
            <el-input placeholder="请输入总分" type="number" v-model="ruleForm.totalScore"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="题型" prop="quesTypes">
            <el-select multiple collapse-tags placeholder="请选择题型" v-model="ruleForm.quesTypes">
              <el-option label="单选题" value="1" />
              <el-option label="多选题" value="2" />
              <el-option label="简答题" value="3" />
              <el-option label="判断题" value="4" />
              <el-option label="编程题" value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select placeholder="请选择分类" v-model="ruleForm.class">
              <el-option label="前端" value="1" />
              <el-option label="后端" value="2" />
              <el-option label="设计" value="3" />
              <el-option label="测试" value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 开始遍历选择的题量 -->
      <el-row :gutter="20" class="mb-4">
        <div :key="index" v-for="(item, index) in ruleForm.quesTypes">
          <el-col :span="12" :offset="0" :class="[index % 2 === 0 ? 'mr-8' : '', 'mb-4']">
            <el-form-item :label="`${mapTtype[item]}题量`" :prop="`count${item}`">
              <el-input placeholder="请输入题量" type="number" v-model="ruleForm[`count${item}`]"> </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-row>

      <el-form-item label="难度系数" prop="level">
        <el-slider v-model="ruleForm.level" :format-tooltip="formatTooltip" />
      </el-form-item>
    </el-form>
    <div
      class="right flex flex-col w-full pl-4 pr-4 items-center justify-between"
      v-if="props.fatherUtils.status === 2"
    >
      <img src="@/assets/image/u727.svg" alt="" class="w-1/5 cursor-pointer" />
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
import { useExamStore, useUserStore } from "@/store";
import { loopToFillState } from "@/utils/methods.js";
import { rules } from "./methods.js";
import { mapTtype } from "@/components/questionBankManagement/constants.js";
import { addExamAuto } from "@/api/examBankManagement.js";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
// 初始化store，我们把考生答案放在pinia中！
const examStore = useExamStore();
const userStore = useUserStore();
const props = defineProps({
  autoRenderForm: Object,
  fatherUtils: Object,
});
const loading = ref(false);
watch(
  () => props.fatherUtils,
  async (newVal) => {
    if (newVal.footerTitle === "确定" && newVal.status === 1) {
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          loading.value = true;
          const payload = {
            examPaperName: ruleForm.examName,
            createBy: userStore.username,
            createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            knowGory: ruleForm.class,
            singleTnum: ruleForm.count1 ? Number(ruleForm.count1) : 0,
            moreTnum: ruleForm.count2 ? Number(ruleForm.count1) : 0,
            judgeTnum: ruleForm.count3 ? Number(ruleForm.count1) : 0,
            ansTnum: ruleForm.count4 ? Number(ruleForm.count1) : 0,
            programTnum: ruleForm.count5 ? Number(ruleForm.count1) : 0,
            pSum: ruleForm.totalScore,
            diff: ruleForm.level,
            types: ruleForm.quesTypes,
          };
          const res = await addExamAuto(payload);
          if (res.code === 200) {
            props.fatherUtils.status = 2;
          } else {
            ElMessage.error("生成失败！");
          }
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
  level: 0,
  totalScore: "",
  quesTypes: [],
  class: "",
  //五种题量
  count1: "",
  count2: "",
  count3: "",
  count4: "",
  count5: "",
});
watch(
  () => ruleForm.quesTypes,
  (newVal) => {
    ruleForm.quesTypesCopy = newVal;
  },
);

const formatTooltip = (val) => {
  return val / 100;
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
:deep(.el-form-item__error) {
  white-space: nowrap;
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
</style>
