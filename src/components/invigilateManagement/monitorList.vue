<template>
  <div class="loop-container-monitor" ref="container" v-loading="loading" element-loading-text="加载中...">
    <div v-for="(item, index) in monitorList.value" :key="index" class="item-exam">
      <!-- 左上角 -->
      <p class="absolute top-0 left-0 mark" v-if="item.examType !== '1'">集中考试</p>
      <img src="@/assets/image/u728.svg" alt="" class="leftTopTag" v-if="item.examType !== '1'" />
      <!-- 右上角 -->
      <el-popconfirm title="确定要删除此场考试吗？" :teleported="true" @confirm.stop="deleteExam(item)">
        <template #reference>
          <el-icon class="deleteIcon" color="#999" v-if="userStore.menuLicenses['试卷管理']?.includes('删除')"
            ><CloseBold
          /></el-icon>
        </template>
      </el-popconfirm>

      <div class="relative mb-4">
        <img src="@/assets/image/u57.svg" alt="" />
        <img class="move-image" src="@/assets/image/u58.svg" alt="" />
      </div>
      <span style="margin-bottom: 4px" class="item-title">{{ item.examName }}</span>
      <span class="item-describe">{{ solveDateRange(item) }}</span>
      <span class="item-describe">时长:{{ item.examLongTime }}分钟</span>
      <div class="flex">
        <el-button
          v-if="item.examType !== '1' && item.examStatus !== '1'"
          :class="[item.examStatus !== '2' ? 'grayColor' : '']"
          plain
          :disabled="item.examStatus !== '2'"
          @click="enterMonitor(item)"
          >{{ solveButtonWord(item) }}</el-button
        >
        <el-button
          round
          style="background-color: #fff;color: #606266;"
          v-else-if="item.examStatus === '1' && userStore.menuLicenses['试卷管理']?.includes('修改')"
          @click="changeExamInfo(item)"
          >修改信息</el-button
        >
      </div>
    </div>
    <!--高度问题，未解决 -->
    <div class="h-24 w-full"></div>
    <UpdateExamModal
      v-model:toggleExamModal="changeInfoModal"
      v-model:record="examInfoRecord"
      @reloadData="loadData(true)"
    ></UpdateExamModal>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { getList, deleteOneExam } from "@/api/invigilateManagement.js";
import dayjs from "dayjs";
import loadsh from "lodash";
import { ElMessage } from "element-plus";
import { useUserStore, useExamStore } from "@/store";
import UpdateExamModal from "./updateExamModal.vue";
const container = ref(null);
const userStore = useUserStore();
const examStore = useExamStore();
let timerList = [];
const props = defineProps({
  renderComponentName: String,
});
const emits = defineEmits();
//加载数据
const params = ref({
  pageNo: 1,
  pageSize: 30,
  total: 0,
});
const loading = ref(false);
//2代表可以监考，最大的值
const mapStatus = {
  1: 2,
  2: 3,
  3: 1,
};
const loadData = async (flag = false) => {
  loading.value = true;
  if (flag) {
    monitorList.value = [];
    timerList.forEach((item) => {
      clearTimeout(item);
    });
  }
  const res = await getList(params.value);
  if (res.code === 200) {
    params.value.total = res.data.total;
    //需要注意，为了更好的体验，需要对每一个数据添加定时器，如果他还没开始，就开始倒计时，时间一到就改状态。
    res.data.records.forEach((item, index) => {
      const deltaTime = dayjs(item.examBeginTime).valueOf() - dayjs().valueOf();
      console.log(deltaTime, "deltaTime");
      if (item.examStatus === "1" && deltaTime > 0) {
        const timer = setInterval(() => {
          monitorList.value[index].examStatus = "2";
          console.log("倒计时结束", item);
          clearInterval(timer);
        }, deltaTime);
        timerList.push(timer);
      }
      monitorList.value.push(item);
    });
  }
  loading.value = false;
};
//检测是不是滑到最底下了
const handlerHeight = () => {
  const scrollTop = document.getElementsByClassName("loop-container-monitor")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("loop-container-monitor")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("loop-container-monitor")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
      params.value.pageNo++;
      loadData();
    }
  }
};
onMounted(() => {
  monitorList.value = [];
  window.addEventListener("scroll", loadsh.throttle(handlerHeight, 300), true);
  loadData();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight);
  timerList.forEach((item) => {
    clearInterval(item);
  });
});

//处理时间
const solveDateRange = (record) => {
  return `${dayjs(record.examBeginTime).format("M月D日 HH:mm:ss")}至${dayjs(record.examEndTime).format(
    "M月D日 HH:mm:ss",
  )}`;
};
//处理下面的按钮文字
const solveButtonWord = (record) => {
  return record.examStatus === "1" ? "暂未开始" : record.examStatus === "2" ? "开始监考" : "已结束";
};
//删除考试
const deleteExam = async (record) => {
  if (record.examStatus === "2") {
    ElMessage.error("正在考试中...无法删除！");
    return;
  }
  const res = await deleteOneExam(record.examId);
  if (res.code === 200) {
    ElMessage.success("删除成功！");
    params.value.pageNo = 1;
    container.value.scrollTop = 0;
    loadData(true);
  } else {
    ElMessage.error("删除失败！");
  }
};
//进入监考
const enterMonitor = (record) => {
  examStore.examName = record.examName;
  examStore.examId = record.examId;
  //需要看一下到底是哪个时间快，应该开始时间就得事当前时间了，因为有可能开考以后才进去的
  examStore.startTimestamp =
    dayjs(record.examBeginTime).unix() < dayjs().unix() ? dayjs().unix() : dayjs(record.examBeginTime).unix();
  examStore.endTimestamp = dayjs(record.examEndTime).unix();
  emits("update:renderComponentName", "WindowsList");
};
//修改信息
const changeInfoModal = ref(false);
const examInfoRecord = ref();
const changeExamInfo = (record) => {
  examInfoRecord.value = record;
  changeInfoModal.value = true;
};
const monitorList = reactive({ value: [] });
</script>
<style lang="less" scoped>
.grayColor {
  background-color: #999 !important;
}
.mark {
  transform: rotate(-45deg);
  font-size: 12px;
  font-weight: 700;
  color: rgb(244, 234, 234);
  z-index: 10;
  position: absolute;
  top: 10px;
  left: -5px;
}
.loop-container-monitor {
  min-height: 70vh;
  max-height: 100vh;
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2em;
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
  .item-exam {
    position: relative;
    margin-right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    background-color: rgba(49, 150, 154, 0.101960784313725);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(49, 150, 154, 1);
    border-radius: 3px;
    margin-top: 0.5rem;
    width: 13rem;
    height: 16rem;
    .leftTopTag {
      position: absolute;
      transform: scale(1.5);
      top: 7px;
      left: 9px;
    }
    .deleteIcon {
      position: absolute;
      cursor: pointer;
      top: 4px;
      right: 4px;
    }
    .move-image {
      position: absolute;
      top: 12px;
      left: 8px;
    }
    .item-title {
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-style: normal;
      font-size: 16px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .item-describe {
      text-align: center;
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
    }
    span {
      margin-bottom: 16px;
    }
    /deep/.el-button {
      background-color: #32969a;
      color: #fff;
      border-radius: 16px;
    }
  }
}
</style>
