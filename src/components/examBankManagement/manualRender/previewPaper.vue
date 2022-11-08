<template>
  <BasicCardVue>
    <template #title>生成试卷</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <span class="titleInfo">{{ title }}</span>
        <el-button type="primary" @click="finishManualRender" :loading="buttonLoading"> 完成 </el-button>
      </div>
    </template>
    <template #mainContent>
      <div class="answer-container">
        <el-input v-model="examName" :placeholder="examPlaceholder" size="normal" clearable></el-input>

        <!-- for loop start-->
        <div class="answers">
          <div v-for="(questions, name) in examStore.answers" :key="name">
            <div class="title" v-if="questions.length > 0">{{ name }} {{ processTitle(questions) }}</div>
            <!-- type inner loop -->
            <div v-for="(question, index) in questions" :key="`${name}-${index}`" class="question">
              <div class="flex flex-nowrap items-center justify-between mt-2 mb-2">
                <div class="left">
                  <div class="flex items-center">
                    <span class="question-title-count">{{ index + 1 }}、</span>
                    <span class="question-title-content">{{ question.tproblem }}</span>
                  </div>
                  <div class="flex items-center pl-4 mt-2">
                    <span class="item-lable ml-4 mr-2">分值:</span>
                    <p class="item-lable-title">{{ question.score }}分</p>
                    <span class="item-lable ml-4 mr-2">难度:</span>
                    <p class="item-lable-title">{{ mapTdiff[question.tdiff] }}</p>
                    <span class="item-lable ml-4 mr-2">知识分类:</span>
                    <p class="item-lable-title">{{ mapKnowGory[question.knowGory] }}</p>
                  </div>
                </div>
                <el-button class="right" size="default" @click="popStore(question, index)">删除</el-button>
              </div>
              <el-divider direction="horizontal"></el-divider>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { useExamStore, useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { reactive, computed, ref } from "vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { mapTdiff, mapKnowGory, mapTtypes } from "@/components/questionBankManagement/constants.js";
import { addExam } from "@/api/examBankManagement.js";
const examStore = useExamStore();
const userStore = useUserStore();
const router = useRouter();
const popStore = (record, index) => {
  examStore.answers[mapTtypes[record.ttype]].splice(index, 1);
  titleMap[record.ttype].typeCount = 0;
  titleMap[record.ttype].typeScore = 0;
};
const titleMap = reactive({});
const processTitle = (records) => {
  if (!titleMap.hasOwnProperty(records[0].ttype)) {
    // 第一次，如果没有就加入，如果有跳过，随后会重置掉
    titleMap[records[0].ttype] = {
      typeCount: 0,
      typeScore: 0,
    };
  }
  let typeTotalScore = 0;
  records.forEach((item) => (typeTotalScore += Number(item.score)));
  titleMap[records[0].ttype]["typeCount"] = records.length;
  titleMap[records[0].ttype]["typeScore"] = typeTotalScore;
  return `共${records.length}题，总分：${typeTotalScore}分`;
};
const title = computed(() => {
  let totleCount = 0;
  let totleScore = 0;
  Object.keys(titleMap).forEach((type) => {
    totleCount += Number(titleMap[type].typeCount);
    totleScore += Number(titleMap[type].typeScore);
  });
  return `总题数:${totleCount} 总分数:${totleScore}`;
});

// 完成试卷
const examName = ref("");
const buttonLoading = ref(false);
const examPlaceholder = `试卷名称：南瑞${userStore.username}在${dayjs().format("YYYY-MM-DD")}所创建的试卷`;
const finishManualRender = async () => {
  if (examName.value === "") {
    ElMessage.error("请输入试卷名称！");
    return;
  }
  buttonLoading.value = true;
  //此处知识分类字段使用的是那种类型的题目最多，就确定为是什么类型
  let tids = "";
  let knowGory = [0, 0, 0, 0];
  Object.keys(examStore.answers).forEach((key, index) => {
    console.log(key, examStore.answers[key]);
    examStore.answers[key].forEach((ques) => {
      knowGory[Number(ques.knowGory) - 1] += 1;
      tids += `${ques.tid},`;
    });
  });
  let maxknowGory = knowGory.sort((a, b) => b - a)[0];
  for (let i = 0; i < knowGory.length; i++) {
    if (maxknowGory === knowGory[i]) {
      maxknowGory = i + 1;
      break;
    }
  }
  let payload = {
    examPaperName: examName.value,
    createBy: userStore.username,
    createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    knowGory: maxknowGory,
    singleTnum: titleMap[1]?.typeCount | 0,
    moreTnum: titleMap[2]?.typeCount | 0,
    judgeTnum: titleMap[3]?.typeCount | 0,
    ansTnum: titleMap[4]?.typeCount | 0,
    programTnum: titleMap[5]?.typeCount | 0,
    tids: tids,
  };
  const res = await addExam(payload);
  if (res.code === 200) {
    ElMessage.success("新增成功！");
    examStore.MyReset();
    router.push("/examBankManagement");
  } else {
    ElMessage.error("新增失败");
  }
  buttonLoading.value = false;
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.titleInfo {
  white-space: nowrap;
  font-family: "ArialMT", "Arial", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  letter-spacing: normal;
  color: #333333;
  margin-right: 1rem;
}
.answer-container {
  min-height: 60vh;
  overflow-y: scroll;
  max-height: 80vh;
  .question {
    display: flex;
    flex-direction: column;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .question-title-count {
      color: #31969a;
    }
    .question-title-content {
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #333333;
      text-align: left;
    }
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: rgba(244, 253, 253, 1);
    font-size: 14px;
    color: #333333;
    text-align: left;
    font-family: "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
  .item-lable {
    white-space: nowrap;
    font-family: "ArialMT", "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
    vertical-align: none;
    text-align: center;
    line-height: normal;
    text-transform: none;
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .item-lable-title {
    white-space: nowrap;
    font-family: "ArialMT", "Arial", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: normal;
    color: #333333;
  }
}
/deep/.el-divider--horizontal {
  margin: 8px 0;
}
</style>
