<template>
  <BasicCardVue>
    <template #title>在线考试</template>
    <template #mainContent>
      <div class="onlineList-container" ref="container" v-loading="loading" element-loading-text="加载中...">
        <!-- loop -->
        <div v-for="item in examList.value" :key="item.index" class="w-full">
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center mb-4">
                <span class="examName">{{ item.examName }}</span>
                <span class="type">{{ item.examLongTime }}分钟</span>
              </div>
              <span class="timeRanges">{{ formatTimeRange(item) }}</span>
            </div>
            <el-button type="primary" size="default" @click="intoExam(item)" :loading="enterLoading"
              :disabled="solveButton(item) != '进入'" v-if="item.isTrue == 1"
              :class="[solveButton(item) != '进入' ? 'grayColor' : '']">{{ solveButton(item) }}</el-button>
          </div>
          <el-divider direction="horizontal" content-position="center"></el-divider>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { getUserExam } from "@/api/user.js";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import lodash from "lodash";
import { ElNotification } from "element-plus";
let timerList = [];
const router = useRouter();
const examStore = useExamStore();
const userStore = useUserStore();
const container = ref();
//处理时间参数
const formatTimeRange = (record) => {
  return `${dayjs(record.examBeginTime).format("MM月DD日 HH:mm:ss")}至${dayjs(record.examEndTime).format(
    "MM月DD日 HH:mm:ss",
  )}`;
};
//处理该考试是否显示进入按钮
const solveButton = (record) => {
  const now = dayjs();
  const beginTime = dayjs(record.examBeginTime);
  const endTime = dayjs(record.examEndTime);
  if (now.isBefore(beginTime)) {
    return "未开始";
  } else if (now.isAfter(endTime)) {
    return "已结束";
  } else {
    return "进入";
  }
};
//加载数据
const params = ref({
  pageStart: 1,
  pageEnd: 10,
  userId: userStore.userId,
});
const examList = reactive({ value: [] });
const loading = ref(false);
const loadData = async (flag = false) => {
  loading.value = true;
  if (flag) {
    examList.value = [];
    timerList.forEach((item) => {
      clearTimeout(item);
    });
  }
  const res = await getUserExam(params.value);
  if (res.code === 200) {
    //需要注意，为了更好的体验，需要对每一个数据添加定时器，如果他还没开始，就开始倒计时，时间一到就改状态。
    res.data.forEach(item => {
      const deltaTime = dayjs(item.examBeginTime).valueOf() - dayjs().valueOf();
      if (deltaTime > 0) {
        const timer = setInterval(() => {
          loadData(true)
          console.log("倒计时结束", item);
          clearInterval(timer);
        }, deltaTime + 5000);
        timerList.push(timer);
      }
      examList.value.push(item)
    })
  }
  loading.value = false;
};
//检测是不是滑到最底下了
const handlerHeight = lodash.throttle(() => {
  const scrollTop = document.getElementsByClassName("onlineList-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("onlineList-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("onlineList-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100 && scrollTop > 0) {
    params.value.pageStart = params.value.pageEnd + 1;
    params.value.pageEnd = params.value.pageEnd + 10;
    loadData();
  }
}, 300);
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight, true);
  timerList.forEach((item) => {
    clearInterval(item);
  });
});
onMounted(() => {
  if (examStore.onLineListHeight < 0) {
    examStore.onLineListHeight = container.value.clientHeight;
  }
  window.addEventListener("scroll", handlerHeight, true);
  setTimeout(() => {
    container.value.style.height = `${examStore.onLineListHeight}px`;
    loadData();
  }, 0);
});

//进入考试
const enterLoading = ref(false);
const intoExam = async (record) => {
  enterLoading.value = true;
  if (dayjs(record.examEndTime).unix() < dayjs().unix()) {
    ElNotification.error("考试已结束");
    enterLoading.value = false;
    return;
  }
  if (dayjs(record.examBeginTime).unix() > dayjs().unix()) {
    ElNotification.error("考试未开始");
    enterLoading.value = false;
    return;
  }
  examStore.MyReset();
  //在此处还需要判断考试类型，
  //还需要注意，如果进入的比较晚，结束时间要取考试结束时间或当前时间+考试时长的最小值
  examStore.startTimestamp = dayjs().unix();
  const endTime1 = dayjs(record.examEndTime).unix() - dayjs().unix();
  const endTime2 = Number(record.examLongTime) * 60;
  if (endTime1 < endTime2) {
    examStore.endTimestamp = dayjs(record.examEndTime).unix();
  } else {
    examStore.endTimestamp = examStore.startTimestamp + Number(record.examLongTime) * 60;
  }
  examStore.examId = record.examId;
  examStore.examName = record.examName;
  examStore.tids = record.tids;
  enterLoading.value = false;
  router.push(`/exam/examing`);
};
</script>
<style lang="less" scoped>
.onlineList-container {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 100%;

  .examName {
    font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    color: #333333;
  }

  .type {
    background-color: red;
    font-family: "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    color: #ffffff;
    font-size: 14px;
    padding: 0px 8px;
    margin-left: 1rem;
    border-radius: 16px;
    background-color: #f7b502;
  }

  .timeRanges {
    font-family: "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #333333;
    text-align: left;
  }
}

.rightLink {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #31969a;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #31969a;
  font-size: 14px;
  cursor: pointer;
}

/deep/.el-divider--horizontal {
  margin: 8px 0px;
}

.grayColor {
  background-color: #999 !important;
}
</style>
