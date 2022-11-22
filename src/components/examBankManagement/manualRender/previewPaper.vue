<template>
  <BasicCardVue>
    <template #title>生成试卷</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <span class="titleInfo">{{ title }}</span>
        <el-button type="primary" @click="finishManualRender" class="animated" ref="buttonRef" :loading="buttonLoading">
          完成
        </el-button>
      </div>
    </template>
    <template #mainContent>
      <div class="answer-container" ref="answerContainerRef" v-loading="loading" element-loading-text="加载中...">
        <el-input
          v-model="examName"
          :placeholder="examPlaceholder"
          size="normal"
          clearable
          style="position: sticky; top: 0px"
        ></el-input>

        <!-- for loop start-->
        <div class="answers">
          <div v-for="(questions, name) in examStore.answers" :key="name">
            <div class="title baseEl" v-if="questions.length > 0">{{ name }} {{ processTitle(questions) }}</div>
            <!-- type inner loop -->
            <div v-for="(question, index) in questions" :key="`${name}-${index}`" class="question">
              <div class="flex flex-nowrap items-center justify-between mt-2 mb-2">
                <div class="left">
                  <div style="flex: 1" class="flex">
                    <span class="question-title-count">{{ index + 1 }}、</span>
                    <span class="question-title-content" v-html="solveWidth(question.tproblem)"></span>
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
import { reactive, computed, ref, onMounted } from "vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { mapTdiff, mapKnowGory, mapTtypes } from "@/components/questionBankManagement/constants.js";
import { addExam, previewExamPaper } from "@/api/examBankManagement.js";
import { useRoute } from "vue-router";
import lodash from "lodash";
const route = useRoute();
const examStore = useExamStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
let flag = false;
// 设置初始高度，要不然无法滚动
const answerContainerRef = ref();
onMounted(() => {
  answerContainerRef.value.style.height = `${answerContainerRef.value.clientHeight}px`;
  answerContainerRef.value.style.width = `${answerContainerRef.value.clientWidth}px`;
  if (route.query.record) {
    //修改试卷！
    initExamStore();
  }
});
const solveWidth = (html) => {
  const el = document.getElementsByClassName("question-title-content");
  if (el.length > 0 && !flag) {
    const baseEl = document.getElementsByClassName("baseEl");
    flag = true;
    el[0].style.width = `${baseEl[0].clientWidth - 100}px`;
  }
  return html;
};
//处理修改试卷传参
const initExamStore = async () => {
  loading.value = true;
  const record = JSON.parse(route.query.record);
  examName.value = record.examPaperName;
  const res = await previewExamPaper({ tids: record.tids });
  if (res.code === 200) {
    while (res.data.length > 0) {
      let item = res.data.pop();
      //处理答案
      examStore.answers[mapTtypes[item.ttype]].push(item);
    }
  }
  loading.value = false;
};
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
const buttonRef = ref();
const examPlaceholder = `试卷名称：南瑞${userStore.username}在${dayjs().format("YYYY-MM-DD")}所创建的试卷`;
const finishManualRender = async () => {
  if (examName.value === "") {
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
    ElMessage.error("请输入试卷名称！");
    return;
  }
  buttonLoading.value = true;
  //此处知识分类字段使用的是那种类型的题目最多，就确定为是什么类型
  //难度字段也是同理，看看那种类型最多
  let tids = "";
  let knowGory = [0, 0, 0, 0];
  let levelOfHard = [0, 0, 0];
  Object.keys(examStore.answers).forEach((key, index) => {
    examStore.answers[key].forEach((ques) => {
      knowGory[Number(ques.knowGory) - 1] += 1;
      levelOfHard[Number(ques.tdiff) - 1] += 1;
      tids += `${ques.tid},`;
    });
  });

  let maxknowGory = knowGory.sort((a, b) => b - a)[0];
  let maxlevelOfHard = lodash.cloneDeep(levelOfHard).sort((a, b) => b - a)[0];
  for (let i = 0; i < knowGory.length; i++) {
    if (maxknowGory === knowGory[i]) {
      maxknowGory = i + 1;
      break;
    }
  }
  for (let i = 0; i < levelOfHard.length; i++) {
    if (maxlevelOfHard === levelOfHard[i]) {
      maxlevelOfHard = i + 1;
      break;
    }
  }
  let totleScore = 0;
  Object.keys(titleMap).forEach((type) => {
    totleScore += Number(titleMap[type].typeScore);
  });
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
    sum: totleScore,
    tids: tids,
    diff: maxlevelOfHard === 1 ? "20" : maxlevelOfHard === 2 ? "50" : "80",
    //20,50,80没有特别定义，只是1/3，2/3的代表
  };
  if (route.query.record) {
    //修改接口
    payload = {
      ...payload,
      examPaperId: JSON.parse(route.query.record).examPaperId,
    };
  }
  const res = await addExam(payload);
  if (res.code === 200) {
    ElMessage.success(route.query.record ? "修改成功！" : "新增成功！");
    router.push("/examBankManagement");
    examStore.MyReset();
  } else {
    ElMessage.error(route.query.record ? "修改失败" : "新增失败");
  }
  buttonLoading.value = false;
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
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
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .answers {
    overflow: scroll;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: #e5e5e5;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background: #ffffff;
    }
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
        width: 100%;
        overflow: hidden;
        white-space: break-spaces;
      }
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
:deep(.language-css) {
  white-space: break-spaces;
}
</style>
