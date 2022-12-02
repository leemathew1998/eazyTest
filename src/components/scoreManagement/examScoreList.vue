<template>
  <div class="examScore-container" ref="container" v-loading.body="loading" element-loading-text="加载中...">
    <div v-for="(item, index) in auditList.value" :key="index"
      class="flex items-center justify-between m-2 shadow-md p-4 examScore-item">
      <div class="flex flex-col">
        <h3 style="font-size: 18px">{{ item.examName }}</h3>
        <template class="flex mt-4">
          <span class="item-lable mr-2">应考人数</span>
          <p class="m-auto whitespace-nowrap" style="color: #31969a">{{ item.sunNum }}人</p>
          <span class="item-lable ml-4 mr-2">实考人数</span>
          <p class="m-auto whitespace-nowrap" style="color: red">{{ item.perNum }}人</p>
          <span class="item-lable ml-4 mr-2">平均分数</span>
          <p class="m-auto whitespace-nowrap" :style="{ 'color': item.markStatus === '3' ? '#999' : '#0091ff' }">{{
              item.markStatus === '3' ? '暂未阅卷' :
                `${item.examAvg}分`
          }}
          </p>
          <span class="item-lable ml-4 mr-2">考试状态</span>
          <p class="m-auto whitespace-nowrap" style="color: #999">{{ mapStatus[item.markStatus] }}</p>
          <span class="item-lable ml-4 mr-2">考试时间</span>
          <p class="m-auto whitespace-nowrap" style="color: #999">{{ item.examTime }}</p>
        </template>
      </div>
      <el-button type="primary" style="border-radius: 16px" @click="openModal(item)">查看</el-button>
    </div>
    <!-- 处理没有参数的展示 -->
    <div v-if="auditList.value.length === 0 && !loading" class="flex justify-center items-center flex-col w-full">
      <el-empty :image-size="150" description="暂无数据" />
    </div>
    <StatisticsModal v-model:toggleModal="toggleModal" :record="modalRecord"></StatisticsModal>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import StatisticsModal from "./statisticsModal.vue";
import emiter from "@/utils/mitt.js";
import dayjs from "dayjs";
import lodash from "lodash";
import { getExamScoreList } from '@/api/scoreManagement.js'
//由于没有total，所以设置一个指来判断是否还有数据
let fullBatch = false;
const mapStatus = {
  1: '已阅卷',
  2: '未完成',
  3: '未阅卷'
}
//搜索内容
emiter.on("pageTwo-search", (newVal) => {
  payload.examName = newVal.examName;
  payload.markStatus = newVal.markStatus;
  payload.beginTime = newVal.timeRange[0] ? dayjs(newVal.timeRange[0]).format("YYYY-MM-DD HH:mm:ss") : "";
  payload.endTime = newVal.timeRange[1]
    ? dayjs.unix(dayjs(newVal.timeRange[1]).unix() + 86399).format("YYYY-MM-DD HH:mm:ss")
    : "";
  loadData(true);
});
const auditList = reactive({ value: [] });
const container = ref();
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  window.addEventListener("scroll", handlerHeight, true);
  loadData();
});
//检测是不是滑到最底下了
const handlerHeight = lodash.throttle(() => {
  //此处没有使用total，有可能会出现问题！！！
  const scrollTop = document.getElementsByClassName("examScore-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("examScore-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("examScore-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100 && scrollTop !== 0 && fullBatch) {
    console.log("滑到最低了，加载数据");
    loadData();
  }
}, 300);
onBeforeUnmount(() => {
  emiter.off("pageTwo-search");
  window.removeEventListener("scroll", handlerHeight, true);
})
//加载数据
const loading = ref(false);
const payload = reactive({
  pageNo: 1000,
  pageSize: 10,
});
const loadData = async (flag = false) => {
  if (flag) {
    payload.pageNo = 1;
    auditList.value = [];
  }
  loading.value = true;
  const res = await getExamScoreList(payload);
  if (res.code === 200 && res.success) {
    fullBatch = res.data.length === 10 ? true : false;
    auditList.value.push(...res.data);
    payload.pageNo++;
  }
  loading.value = false;
};
const toggleModal = ref(false);
const modalRecord = ref();
const openModal = (item) => {
  toggleModal.value = true;
  modalRecord.value = item
};
</script>
<style lang="less" scoped>
.examScore-container {
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  margin-bottom: 2em;
  height: 100%;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
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

  .examScore-item {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 8px;
    width: 98%;

    .mark {
      transform: rotate(-45deg);
      font-size: 12px;
      color: rgb(244, 234, 234);
      z-index: 10;
      position: absolute;
      top: 4px;
    }

    .item-h5 {
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #666666;
    }

    .item-lable {
      white-space: nowrap;
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
  }
}

/deep/.title-border {
  border-bottom: 0px !important;
}
</style>
