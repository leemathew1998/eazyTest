<template>
  <BlankCardHFull>
    <template #mainContent>
      <div class="answer-container h-full">
        <!-- for loop start-->
        <div style="flex: 1" class="flex flex-col overflow-hidden" v-loading="loading">
          <div class="item-title">
            <span class="item-title-content">{{ questionsList.value[currentIndex]?.tproblem || '' }}</span>
          </div>
          <div class="flex mb-2" style="flex: 1" v-if="questionsList.value.length > 0">
            <div class="" style="flex: 1">
              <BasicCard>
                <template #title>用户答案</template>
                <template #mainContent>
                  <el-input v-model="questionsList.value[currentIndex].userAns" show-word-limit type="textarea" disabled
                    class="h-full" />
                </template>
              </BasicCard>
            </div>
            <div style="flex: 1;" class="flex flex-col ml-2 mr-2">
              <BasicCard>
                <template #title>正确答案</template>
                <template #mainContent>
                  <el-input v-model="questionsList.value[currentIndex].answer" show-word-limit type="textarea" disabled
                    class="h-full" />
                </template>
              </BasicCard>
              <BasicCard class="mt-2" :style="{ 'height': iconRotate === 90 ? '40px' : '100%' }">
                <template #title>答案解析</template>
                <template #topRight>
                  <el-icon :size="30" @click="changeIconDirection" class="topRight_icon"
                    :style="{ 'transform': `rotate(${iconRotate}deg)` }">
                    <DArrowLeft />
                  </el-icon>
                </template>
                <template #mainContent>
                  <el-input v-model="questionsList.value[currentIndex].answerInfo" show-word-limit type="textarea"
                    disabled class="h-full" />
                </template>
              </BasicCard>
            </div>

            <div style="flex: 1">
              <BasicCard>
                <template #title>得分</template>
                <template #mainContent>
                  <div class="flex flex-col h-full">
                    <el-input v-model="examStore.reviewScore[currentIndex]" placeholder="请输入分数,按下回车自动跳到下一题" autofocus />
                    <div class="flex justify-end mt-4">
                      <el-button type="primary" @click="prev">
                        <el-icon>
                          <ArrowLeftBold />
                        </el-icon>
                        上一题
                      </el-button>
                      <el-button type="primary" @click="next" :loading="nextLoading">
                        下一题
                        <el-icon>
                          <ArrowRightBold />
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                </template>
              </BasicCard>
            </div>
          </div>
          <el-empty :image-size="150" description="暂无数据" v-else />
        </div>
      </div>
    </template>
  </BlankCardHFull>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import BlankCardHFull from "@/components/blankCardHFull.vue";
import { useExamStore, useUserStore } from "@/store";
import BasicCard from "@/components/basicCard.vue";
import { ElMessage, ElNotification } from "element-plus";
import { getScoringList, updateScoringStatus } from '@/api/reviewManagement.js'
import { useRouter } from "vue-router";
import { EncryptScore } from "@/utils/methods.js";
import { updateCodingScore } from "@/api/examBankManagement.js";
// 填充答案，
const examStore = useExamStore();
const userStore = useUserStore();
const router = useRouter();
onMounted(() => {
  loadScoringList()
});
const questionsList = reactive({ value: [] });
const currentIndex = ref(0);
const loading = ref(false);
const loadScoringList = async () => {
  loading.value = true;
  const res = await getScoringList({ examId: examStore.examId })
  if (res.code === 200) {
    questionsList.value = res.data
    examStore.reviewScore = new Array(res.data.length).fill('');
  } else {
    ElNotification.error({
      title: '获取答案失败',
      message: res.msg
    })
  }
  loading.value = false;
}

//处理答案解析的右上角图标
const iconRotate = ref(90);
const changeIconDirection = () => {
  iconRotate.value = iconRotate.value === 270 ? 90 : 270;
}
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};
const nextLoading = ref(false);
const next = async () => {
  nextLoading.value = true;
  if (Number(examStore.reviewScore[currentIndex.value]) > Number(questionsList.value[currentIndex.value].score)) {
    ElMessage.error(`该题目最高得分为${questionsList.value[currentIndex.value].score}分`)
    nextLoading.value = false;
    return
  }
  const payload = {
    ansScore: EncryptScore(examStore.reviewScore[currentIndex.value]),
    tid: questionsList.value[currentIndex.value].tid,
    examId: examStore.examId,
    userId: questionsList.value[currentIndex.value].userId
  };
  const res1 = await updateCodingScore(payload)
  if (res1.code !== 200) {
    ElNotification.error({
      title: '更新分数失败',
      message: res1.message
    })
  }

  if (currentIndex.value === questionsList.value.length - 1) {
    const res = await updateScoringStatus({
      examId: examStore.examId,
      examPaperId: examStore.tids,
      userId: questionsList.value.map(item => item.userId),
      markStatus: 1,
      markBy: userStore.username
    })
    if (res.code === 200) {
      ElNotification({
        title: "阅卷完成",
        message: `考试：${examStore.examName}，阅卷已完成`,
        type: "success",
      });
    } else {
      ElNotification.error({
        title: '更新状态失败',
        type: 'error',
      })
    }
    router.push('/reviewManagement')
  } else {
    currentIndex.value += 1;
  }
  nextLoading.value = false;
};
// 检测键盘
window.onkeydown = function (event) {
  if (event.keyCode == 13) {
    next();
  }
};
</script>
<style lang="less" scoped>
.answer-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
      color: #31969a;
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

.item-lable {
  font-family: "ArialMT", "Arial", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  letter-spacing: normal;
  color: #333333;
  vertical-align: none;
  text-align: center;
  line-height: normal;
  text-transform: none;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.topRight_icon {
  transition: all .5s ease;
}

/deep/.el-textarea__inner {
  width: 100% !important;
  height: 100% !important;
}
</style>
