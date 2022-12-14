<template>
  <BasicCardVue>
    <template #title>阅卷列表</template>
    <template #mainContent>
      <div class="audit-container" ref="container" v-loading="loading" element-loading-text="加载中...">
        <div v-for="(item, index) in auditList.value"
          class="flex items-center justify-between m-2 shadow-md p-4 audit-item" :key="index">
          <!-- left -->
          <div class="relative flex">
            <img src="@/assets/image/u727.svg" alt="" />
            <p class="absolute top-0 left-0 mark" v-if="item.isFresh">最新</p>
            <img src="@/assets/image/u728.svg" alt="" class="absolute top-0 left-0" v-if="item.isFresh" />
            <!-- 标题 -->
            <div class="flex flex-col ml-4 justify-between">
              <h3 style="font-size: 18px">{{ item.examName }}</h3>
              <h5 class="item-h5">
                {{ dayjs(item.examBeginTime).format("MM-DD HH:mm:ss") }}至{{
                    dayjs(item.examEndTime).format("MM-DD HH:mm:ss")
                }}
              </h5>
              <template class="flex">
                <span class="item-lable mr-2">应考人数</span>
                <p class="m-auto" style="color: #31969a">{{ item.sunNum }}人</p>
                <span class="item-lable ml-4 mr-2">实考人数</span>
                <p class="m-auto" style="color: red">{{ item.perNum }}人</p>
              </template>
            </div>
          </div>
          <!-- right disabled中，已阅卷、应考实考人数不一致不能进入！ -->
          <el-button type="primary" style="border-radius: 16px !important" :disabled="rightButtonDisabled(item)"
            :class="[rightButtonDisabled(item) ? 'grayColor' : '']" @click="startToReviewExam(item)">{{
                solveButtonWord(item)
            }}
          </el-button>
        </div>
        <div v-if="auditList.value.length === 0" class="flex justify-center items-center flex-col w-full">
          <el-empty :image-size="150" description="暂无数据" />
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { useRouter } from "vue-router";
import { getList, getScoringList } from "@/api/reviewManagement.js";
import { useExamStore } from "@/store";
import lodash from "lodash";
import dayjs from "dayjs";
const router = useRouter();
const container = ref();
const examStore = useExamStore();
//获取数据
const loading = ref(false);
const auditList = reactive({ value: [] });
const params = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
const loadData = async () => {
  loading.value = true;
  const res = await getList(params.value);
  if (res.code === 200) {
    params.value.total = res.data.total;
    //被后端气死了，这个接口还包含了没有简答题的数据，就是说不需要阅卷的数据，
    //只能多调用一次接口，然后把这个数据过滤掉
    const requestList = []
    for (let i = 0; i < res.data.records.length; i++) {
      requestList.push(getScoringList({ examId: res.data.records[i].examId }))
    }
    const res1 = await Promise.all(requestList)
    res1.forEach((item, index) => {
      if (item.code === 200 && item.success && item.data.length > 0) {
        auditList.value.push(res.data.records[index]);
      }
    })
  }
  loading.value = false;
};
const startToReviewExam = (record) => {
  examStore.examId = record.examId;
  examStore.examName = record.examName;
  examStore.tids = record.examPaperId;
  router.push("/exam/review");
};
//处理下面的按钮文字
const solveButtonWord = (record) => {
  if (record.markStatus === "1") {
    return '已阅卷'
  } else if (record.markStatus === "2") {
    return '未完成阅卷'
  } else if (record.markStatus === "3" && dayjs().isBefore(dayjs(record.examEndTime)) && dayjs().isAfter(dayjs(record.examBeginTime)) && record.sunNum !== record.perNum) {
    return '考试中，稍等片刻'
  } else if (record.perNum > 0) {
    return '开始阅卷'
  } else {
    return '暂时无法阅卷'
  }
  //  record.examStatus === "1" ? "暂未开始" : record.examStatus === "2" ? "开始监考" : "已结束";
};
const rightButtonDisabled = (record) => {
  //暂定，如果是已阅卷，或者是考试中，且应考实考人数不一致，就不能进入 || record.examStatus !== "3"
  if (record.markStatus === "1" || record.perNum === 0 || record.sunNum !== record.perNum) {
    return true
  } else {
    return false
  }
};
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  window.addEventListener("scroll", handlerHeight, true);
  loadData();
});
//检测是不是滑到最底下了
const handlerHeight = lodash.throttle(() => {
  const el = document.getElementsByClassName("audit-container")[0]
  const scrollTop = el?.scrollTop;
  const clientHeight = el?.clientHeight;
  const scrollHeight = el?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100 && scrollTop > 0) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
      params.value.pageNo++;
      loadData();
    }
  }
}, 300);
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight, true);
});
</script>
<style lang="less" scoped>
.grayColor {
  background-color: #999 !important;
}

.audit-container {
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
    height: 0px;
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

  .audit-item {
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
</style>
