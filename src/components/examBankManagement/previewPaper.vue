<template>
  <el-dialog v-model="togglePreviewPaper" title="试卷预览" width="50%" fullscreen @closed="closeModal"
    :destroy-on-close="true" class="specialHandlingForPreviewPaper">
    <div class="answer-container" v-loading="loading" element-loading-text="加载中...">
      <!-- for loop start-->
      <div class="answers">
        <div v-for="(items, index) in questions.value" :key="index">
          <!-- 开始遍历每一种类型 -->
          <div v-for="(item, i) in items" :key="`${index}-${i}`">
            <div class="item-title">
              <span class="item-title-count">{{ item.count }}、</span>
              <span class="item-title-content" v-html="item.tproblem"></span>
            </div>
            <div class="item-options">
              <!-- 需要在此处对选项进行调整 -->
              <component :disable="true" :is="stringMapInstance[item.ttype]" :innerIndex="i" :record="item"></component>
            </div>
          </div>
        </div>
        <!-- 一直没有解决的高度问题 -->
        <div class="h-2"></div>
      </div>
    </div>
    <div class="downloadExam">
      <el-checkbox v-model="showExamAnswers" class="pr-4">包含答案</el-checkbox>
      <el-button @click="downloadPDF" :loading="downloadPDFLoading">
        <div class="relative mr-2">
          <img src="@/assets/image/u530.svg" />
          <img class="absolute" style="top: 1px; left: 1px; border: 1px solid #fff;transform: rotate(270deg);"
            src="@/assets/image/u531.svg" />
        </div>
        下载试卷
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { previewExamPaperWithAnswers } from "@/api/examBankManagement.js";
import { useExamStore } from "@/store";
import { mapEnToCN } from "./constants.js";
import { htmlToPdf } from './methods.js'
import { Radio, CheckBox, WriteDown, Judge, Coding } from "@/components/onExam/optionModules";
import lodash from 'lodash'
const examStore = useExamStore();
// 状态参数
const props = defineProps({
  togglePreviewPaper: Boolean,
  examName: String,
  tids: String,
});
const emit = defineEmits();
const closeModal = () => {
  examStore.MyReset();
  emit("update:togglePreviewPaper", false);
};
//是否包含答案？现在的思路是把答案先放在别的store里面，选中就再赋值回来。
const showExamAnswers = ref(true);
watch(() => showExamAnswers.value, (newVal) => {
  if (newVal) {
    //选中了，就把答案赋值回来
    examStore.answers = lodash.cloneDeep(examStore.oldAnswers)
  } else {
    //没选中，就把答案清空
    examStore.resetAnswers();
  }
})
//打开弹窗后就请求数据
watch(
  () => props.togglePreviewPaper,
  (newVal) => {
    if (newVal) {
      previewExam();
    }
  },
);
const loading = ref(false);
const questions = reactive({ value: {} });
const previewExam = async () => {
  loading.value = true;
  examStore.MyReset();
  questions.value = {};
  const res = await previewExamPaperWithAnswers({ tids: props.tids });
  let count = 1;
  if (res.code === 200) {
    while (res.data.length > 0) {
      let item = res.data.pop();
      //处理答案
      if (mapEnToCN[item.ttype] === "多选") {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: item.answer.split(""),
        });
      } else if (mapEnToCN[item.ttype] === "编程") {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: JSON.parse(item.testOutput),
          defaultCodeLanguage: "JavaScript",
        });
      } else if (mapEnToCN[item.ttype] === "判断") {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: item.answer === "正确" ? "1" : "0",
        });
      } else {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: item.answer,
        });
      }
      //把答案备份一下
      examStore.oldAnswers = lodash.cloneDeep(examStore.answers)
      //处理题目
      if (!questions.value[mapEnToCN[item.ttype]]) {
        questions.value[mapEnToCN[item.ttype]] = [];
      }
      item.count = count;
      questions.value[mapEnToCN[item.ttype]].push(item);
      count++;
    }
  }
  loading.value = false;
};
//下载文件，暂时又前端下载
const downloadPDFLoading = ref(false);
const downloadPDF = async () => {
  downloadPDFLoading.value = true;
  await htmlToPdf(props.examName)
  downloadPDFLoading.value = false;
}
const stringMapInstance = {
  1: Radio,
  2: CheckBox,
  3: Judge,
  4: WriteDown,
  5: Coding,
};
</script>
<style lang="less" scoped>
.specialHandlingForPreviewPaper {
  position: relative;

  .answer-container {
    min-height: 60vh;
    overflow-y: scroll;
    max-height: 100%;

    .item-title {
      display: flex;
      flex-wrap: nowrap;

      .item-title-count {
        color: #31969a;
      }

      .item-title-content {
        font-family: "思源黑体 CN", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #333333;
        text-align: left;
      }
    }
  }

  .downloadExam {
    position: absolute;
    top: 1rem;
    right: 3rem;
    display: flex;
    align-items: center;
  }
}


.qusetionTypeTitle {
  background-color: rgba(244, 253, 253, 1);
  font-size: 14px;
  color: #333333;
  text-align: left;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
}

/deep/.el-textarea__inner {
  width: 100% !important;
}

:deep(.el-dialog) {
  .el-dialog__body {
    padding: 0 1rem !important;
  }
}

.wjk {
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
