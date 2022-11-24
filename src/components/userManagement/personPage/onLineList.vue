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
            <el-button type="primary" size="default" @click="intoExam(item)" :loading="enterLoading">进入</el-button>
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

//加载数据
const params = ref({
  pageStart: 1,
  pageEnd: 10,
  userId: userStore.userId,
});
const examList = reactive({ value: [] });
const loading = ref(false);
const loadData = async () => {
  loading.value = true;
  const res = await getUserExam(params.value);
  if (res.code === 200) {
    examList.value.push(...res.data);
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
});
onMounted(() => {
  if (examStore.onLineListHeight < 0) {
    examStore.onLineListHeight = container.value.clientHeight;
  }
  setTimeout(() => {
    container.value.style.height = `${examStore.onLineListHeight}px`;
    loadData();
    window.addEventListener("scroll", handlerHeight, true);
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
  //还需要注意，如果进入的比较晚，结束时间要取考试结束时间和当前时间+考试时长的最小值
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
</style>
