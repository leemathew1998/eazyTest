<template>
  <el-dialog
    v-model="props.togglePreviewPaper"
    title="试卷预览"
    width="50%"
    @closed="closeModal"
    :destroy-on-close="true"
  >
    <div class="answer-container">
      <!-- for loop start-->
      <div class="answers">
        <div
          v-for="(item, index) in questions"
          :key="`${item.type}-${item.count}`"
          :class="[`${item.type}-${item.count}`, `${item.type}`]"
        >
          <div class="item-title">
            <span class="item-title-count">{{ item.count }}、</span>
            <span class="item-title-content">{{ item.content }}</span>
          </div>
          <div class="item-options">
            <!-- 需要在此处对选项进行调整 -->
            <component :is="stringMapInstance[item.type]" :record="item"></component>
          </div>
        </div>
        <!-- 一直没有解决的高度问题 -->
        <div class="h-2"></div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { questions } from "@/components/onExam/constants.js";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "@/components/onExam/optionModules";
// 状态参数
const props = defineProps({
  togglePreviewPaper: Boolean,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:togglePreviewPaper", false);
};
const stringMapInstance = {
  单选: Radio,
  多选: CheckBox,
  判断: Judge,
  简答: WriteDown,
  编程: Coding,
};
</script>
<style lang="less" scoped>
.answer-container {
  min-height: 60vh;
  overflow-y: scroll;
  max-height: 80vh;
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
</style>
