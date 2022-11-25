<template>
  <BlankCardHFull>
    <template #mainContent>
      <div class="answer-container h-full">
        <!-- for loop start-->
        <div style="flex: 1" :class="['flex', 'flex-col']">
          <div class="item-title">
            <span class="item-title-content">{{ questionsList.value[currentIndex]?.tproblem || '' }}</span>
          </div>
          <div class="flex" style="flex: 1" v-if="questionsList.value.length > 0">
            <div style="flex: 1">
              <BasicCard>
                <template #title>正确答案</template>
                <template #mainContent>
                  <el-input v-model="questionsList.value[currentIndex].answer" show-word-limit type="textarea" disabled
                    class="h-full" />
                </template>
              </BasicCard>
            </div>
            <div class="ml-2 mr-2" style="flex: 1">
              <BasicCard>
                <template #title>用户答案</template>
                <template #mainContent>
                  <el-input v-model="questionsList.value[currentIndex].userAns" show-word-limit type="textarea" disabled
                    class="h-full" />
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
                      <el-button type="primary" @click="next">
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
import { useExamStore } from "@/store";
import BasicCard from "@/components/basicCard.vue";
import { ElNotification } from "element-plus";
import { getScoringList, updateScoringStatus } from '@/api/reviewManagement.js'
import { useRouter } from "vue-router";
import { updateCodingScore } from "@/api/examBankManagement.js";
// 填充答案，
const examStore = useExamStore();
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

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};
const next = async () => {
  const payload = {
    ansScore: examStore.reviewScore[currentIndex.value],
    tid: questionsList.value[currentIndex.value].tid,
    examId: examStore.examId,
    userId: questionsList.value[currentIndex.value].userId
  };
  updateCodingScore(payload).then((res) => {
    if (res.code !== 200) {
      ElNotification.error({
        title: '更新分数失败',
        message: res.msg
      })
    }
  });

  if (currentIndex.value === questionsList.value.length - 1) {
    const res = await updateScoringStatus({
      examId: examStore.examId,
      examPaperId: examStore.tids,
      userId: questionsList.value.map(item => item.userId).join(',')
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

/deep/.el-textarea__inner {
  width: 100% !important;
  height: 100% !important;
}
</style>
