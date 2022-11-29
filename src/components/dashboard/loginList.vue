<template>
  <BasicCardVue>
    <template #title>登录日志列表</template>
    <template #mainContent>
      <div class="loginList-container" ref="container" v-loading="loading" element-loading-text="加载中...">
        <div v-for="(item, index) in loginList.value" :key="index" class="renderItem">
          <span class="name">{{ item.userName }}</span>
          <span class="main">{{ item.theGroup }}</span>
          <span class="time">{{ dayjs(item.loginTime).format('MM-DD HH:mm:ss') }}</span>
        </div>
        <!-- 处理没有参数的展示 -->
        <div v-if="loginList.value.length === 0 && !loading" class="flex justify-center items-center flex-col w-full">
          <el-empty :image-size="150" description="暂无数据" />
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, onMounted, onBeforeUnmount, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { getLoginList } from "@/api/dashborad.js";
import emiter from "@/utils/mitt.js";
import dayjs from "dayjs";
import lodash from "lodash";
const loginList = reactive({ value: [] });
const loading = ref(false);
const container = ref();
onMounted(async () => {
  container.value.style.height = `${container.value.clientHeight}px`;
  window.addEventListener("scroll", handlerHeight, true);
});
onBeforeUnmount(() => {
  emiter.off("dashboard-searchArea");
  window.removeEventListener("scroll", handlerHeight, true);
});
emiter.on("dashboard-searchArea", (e) => {
  params.stratTime = dayjs(e.dateRange[0]).format("YYYY-MM-DD HH:mm:ss");
  params.endTime = dayjs.unix(dayjs(e.dateRange[1]).unix() + 86399).format("YYYY-MM-DD HH:mm:ss");
  params.pageNo = 1;
  params.pageSize = 50;
  params.total = 0;
  loadData(true);
});

const handlerHeight = lodash.throttle(() => {
  const scrollTop = document.getElementsByClassName("loginList-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("loginList-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("loginList-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight >= scrollHeight - 100 && params.total > params.pageNo * params.pageSize && scrollTop > 0) {
    params.pageNo++;
    loadData();
  }
}, 300);

const params = {
  pageNo: 1,
  pageSize: 40,
  total: 0,
  stratTime: "",
  endTime: "",
};
const loadData = async (flag = false) => {
  if (flag) {
    loginList.value = [];
  }
  // 请求数据
  loading.value = true;
  const res = await getLoginList(params);
  if (res.code === 200) {
    params.total = res.data.total;
    loginList.value.push(...res.data.records);
  }
  loading.value = false;
};

</script>
<style lang="less" scoped>
.loginList-container {
  display: flex;
  // flex-direction: column;
  flex-wrap: wrap;
  overflow: scroll;
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

  .renderItem {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 1rem;
    width: 32%;
    margin-bottom: 1rem;

    .name {
      flex: 1;
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      white-space: wrap;
      font-size: 14px;
    }

    .main {
      flex: 1;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-size: 14px;
      // white-space: nowrap;
      color: #999999;
    }

    .time {
      flex: 2;
      display: flex;
      justify-content: flex-end;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      white-space: nowrap;
    }
  }
}
</style>
