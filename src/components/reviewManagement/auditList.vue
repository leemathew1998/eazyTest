<template>
  <BasicCardVue>
    <template #title>阅卷列表</template>
    <template #mainContent>
      <div class="audit-container" ref="container" v-loading="loading">
        <div
          v-for="(item, index) in auditList.value"
          class="flex items-center justify-between m-2 shadow-md p-4 audit-item"
          :key="index"
        >
          <!-- left -->
          <div class="relative flex">
            <img src="@/assets/image/u727.svg" alt="" />
            <p class="absolute top-0 left-0 mark">最新</p>
            <img src="@/assets/image/u728.svg" alt="" class="absolute top-0 left-0" />
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
          <!-- right -->
          <el-button type="primary" style="border-radius: 16px" @click="startToReviewExam">阅卷</el-button>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { useRouter } from "vue-router";
import { getList } from "@/api/reviewManagement.js";
import lodash from "lodash";
import dayjs from "dayjs";
const router = useRouter();
const container = ref();
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
    auditList.value.push(...res.data.records);
  }
  loading.value = false;
};
const startToReviewExam = () => {
  router.push("/exam/review");
};
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  window.addEventListener("scroll", lodash.throttle(handlerHeight, 300), true);
  loadData();
});
//检测是不是滑到最底下了
const handlerHeight = () => {
  const scrollTop = document.getElementsByClassName("audit-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("audit-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("audit-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
      params.value.pageNo++;
      loadData();
    }
  }
};
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight);
});
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
.audit-container {
  min-height: 70vh;
  max-height: 100vh;
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 2em;
  height: 100%;

  .audit-item {
    border-radius: 8px;
    width: 100%;
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
