<template>
  <div class="flex flex-col h-full">
    <div class="mt-4">
      <Header :questions="questions" returnPath="/exam/userManagement"></Header>
    </div>
    <div class="flex mt-2 h-full">
      <div class="left">
        <CategoryModule></CategoryModule>
      </div>
      <div class="main ml-2 mr-2">
        <!-- <AnswerArea :questions="questions"></AnswerArea> -->
        <AnswerAreaV2 :questions="questions"></AnswerAreaV2>
      </div>
      <div class="right">
        <PersonModule :count="totalQuesLength" :questions="questions"></PersonModule>
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from "@/components/onExam/header.vue";
import AnswerArea from "@/components/onExam/answerArea.vue";
import AnswerAreaV2 from "@/components/onExam/answerAreaV2.vue";
import CategoryModule from "@/components/onExam/categoryModule.vue";
import PersonModule from "@/components/onExam/personModule.vue";
import { mapEnToCN } from "@/components/examBankManagement/constants.js";
import { useExamStore } from "@/store";
import lodash from 'lodash'
import { reactive, ref, onMounted } from "vue";
import { previewExamPaper } from "@/api/examBankManagement.js";
const examStore = useExamStore();
const questions = reactive({ value: {} });
const totalQuesLength = ref(0);
onMounted(() => {
  loadData();
});
const loadData = async () => {
  const res = await previewExamPaper({ tids: examStore.tids });
  let count = 1;
  if (res.code === 200) {
    totalQuesLength.value = res.data.length;
    while (res.data.length > 0) {
      let item = res.data.pop();
      //处理答案
      if (mapEnToCN[item.ttype] === "多选") {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: [],
        });
      } else if (mapEnToCN[item.ttype] === "编程") {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: JSON.parse(item.testOutput),
          JavaScriptlength: JSON.parse(item.testOutput).JavaScript.length,
          Javalength: JSON.parse(item.testOutput).Java.length,
          defaultCodeLanguage: "JavaScript",
          testInput: JSON.parse(item.testInput),
        });
      } else {
        examStore.answers[mapEnToCN[item.ttype]].push({
          answer: "",
        });
      }
      //复制一份数据
      examStore.oldAnswers = lodash.cloneDeep(examStore.answers);

      //处理题目
      if (!questions.value[mapEnToCN[item.ttype]]) {
        questions.value[mapEnToCN[item.ttype]] = [];
      }
      item.count = count;
      questions.value[mapEnToCN[item.ttype]].push(item);
      count++;
    }
  }
};
</script>
<style lang="less" scoped>
.left {
  flex: 2;
}

.right {
  flex: 1.5;
}

.main {
  flex: 6;
}
</style>
