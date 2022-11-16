<template>
  <BasicCardVue>
    <template #title>在线考试</template>
    <template #mainContent>
      <div class="onlineList-container" ref="container" v-loading="loading">
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
            <el-button type="primary" size="default" @click="intoExam(item)">进入</el-button>
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
import { CryptojsSet } from "@/views/login/methods.js";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import lodash from "lodash";
import { ElMessageBox } from "element-plus";
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
  pageNo: 1,
  pageSize: 20,
  userId: userStore.userId,
  total: 0,
});
const examList = reactive({ value: [] });
const loading = ref(false);
const loadData = async () => {
  loading.value = true;
  //2代表可以监考，最大的值
  const mapStatus = {
    1: 2,
    2: 3,
    3: 1,
  };
  const res = await getUserExam(params.value);
  console.log(res);
  if (res.code === 200) {
    res.data.sort((prev, next) => {
      return dayjs(prev.examBeginTime).valueOf() - dayjs(next.examBeginTime).valueOf();
    });
    // res.data.sort((prev, next) => {
    //   return mapStatus[next.examStatus] - mapStatus[prev.examStatus];
    // });
    examList.value.push(...res.data);
  }
  loading.value = false;
};
//检测是不是滑到最底下了
const handlerHeight = () => {
  const scrollTop = document.getElementsByClassName("onlineList-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("onlineList-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("onlineList-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100) {
    console.log("滑到最低了，加载数据");
    params.value.pageNo++;
    loadData();
  }
};
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight);
});
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  loadData();
  window.addEventListener("scroll", lodash.throttle(handlerHeight, 300), true);
});

//进入考试
const intoExam = async (record) => {
  if (dayjs(record.examEndTime).unix() < dayjs().unix()) {
    ElMessageBox.error("考试已结束");
    return;
  }
  examStore.examId = record.examId;
  examStore.startTimestamp = dayjs(record.examBeginTime).unix();
  examStore.endTimestamp = dayjs(record.examEndTime).unix();
  examStore.examName = record.examName;
  examStore.examId = record.examId;
  router.push(`/exam/examing?tids=${CryptojsSet(record.tids)}&examId=${record.examId}`);
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
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
