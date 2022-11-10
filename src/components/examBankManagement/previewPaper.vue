<template>
  <el-dialog
    v-model="props.togglePreviewPaper"
    title="试卷预览"
    width="50%"
    fullscreen
    @closed="closeModal"
    :destroy-on-close="true"
    class="specialHandlingForPreviewPaper"
  >
    <div class="answer-container" v-loading="loading">
      <!-- for loop start-->
      <div class="answers">
        <div v-for="(items, index) in questions.value" :key="index">
          <!-- 开始遍历每一种类型 -->
          <div v-for="(item, i) in items" :key="`${index}-${i}`">
            <div class="item-title">
              <span class="item-title-count">{{ item.count }}、</span>
              <span class="item-title-content">{{ item.tproblem }}</span>
            </div>
            <div class="item-options">
              <!-- 需要在此处对选项进行调整 -->
              <component :is="stringMapInstance[item.ttype]" :innerIndex="i" :record="item"></component>
            </div>
          </div>
        </div>
        <!-- 一直没有解决的高度问题 -->
        <div class="h-2"></div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { previewExamPaper } from "@/api/examBankManagement.js";
import { useExamStore } from "@/store";
import { mapEnToCN } from "./constants.js";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "@/components/onExam/optionModules";
const examStore = useExamStore();
// 状态参数
const props = defineProps({
  togglePreviewPaper: Boolean,
  tids: String,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:togglePreviewPaper", false);
};
//打开弹窗后就请求数据
watch(
  () => props.togglePreviewPaper,
  (newVal) => {
    console.log(123);
    if (newVal) {
      previewExam();
    } else {
      examStore.MyReset();
    }
  },
);
const loading = ref(false);
const questions = reactive({ value: {} });
const previewExam = async () => {
  loading.value = true;
  examStore.MyReset();
  const res = await previewExamPaper({ tids: props.tids });
  let count = 1;
  if (res.code === 200) {
    while (res.data.length > 0) {
      let item = res.data.pop();
      //处理答案
      examStore.answers[mapEnToCN[item.ttype]].push({
        answer: mapEnToCN[item.ttype] === "多选" ? [] : "",
      });
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
const stringMapInstance = {
  1: Radio,
  2: CheckBox,
  3: Judge,
  4: WriteDown,
  5: Coding,
};
</script>
<style lang="less" scoped>
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
