<template>
  <BasicCardVue>
    <template #title>我的公告</template>
    <template #mainContent>
      <div class="announcement-container" v-loading="loading" element-loading-text="加载中...">
        <!-- start loop -->
        <div v-for="item in renderList.value" :key="item.index" class="flex justify-between mb-2 w-full">
          <div class="flex justify-start">
            <span class="item-span" style="width: 12rem;">{{ item.examName }}</span>
            <span class="item-span">得分:{{ item.markStatus == 3 ? '暂无' : item.scoreSum + '分' }}</span>
            <span class="item-span">平均分:{{ item.markStatus == 3 ? '暂无' : item.examAvg + '分' }}</span>
            <span class="item-span">排名:{{ item.markStatus == 3 ? '暂无' : '第' + changeNumToHan(item.rank) + '名' }}</span>
            <span class="item-span" style="width: 20rem">考试时间:{{ dayjs(item.examTime).format('YYYY-MM-DD HH:mm') }}</span>
          </div>
          <!-- <div class="rightLink" @click="openModal(item)">
            <a class="whitespace-nowrap">查看试卷详情</a>
            <el-icon><ArrowRight /></el-icon>
          </div> -->
        </div>
        <el-empty v-if="renderList.value.length === 0" :image-size="50" description="暂无数据" />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive, onMounted, onUnmounted, ref } from "vue";
import { getAnnouncementList } from "@/api/userManagement.js";
import { useUserStore } from "@/store";
import { changeNumToHan } from '@/utils/methods.js'
import lodash from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
const userStore = useUserStore();
const renderList = reactive({ value: [] });
onMounted(async () => {
  window.addEventListener("scroll", handlerHeight, true);
  loadList();
});
onUnmounted(() => {
  window.removeEventListener("scroll", handlerHeight, true);
});
//检测是不是滑到最底下了
const handlerHeight = lodash.throttle(() => {
  const scrollTop = document.getElementsByClassName("announcement-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("announcement-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("announcement-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight > scrollHeight - 100) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
      loadList();
    }
  }
}, 300);
//打开模态框
const openModal = (item) => {
  ElMessageBox.alert("此处还未做", "Title", {
    confirmButtonText: "OK",
    callback: (action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
    },
  });
};



//列表数据
const params = ref({
  userId: userStore.userId,
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
const loading = ref(false);
const loadList = async () => {
  loading.value = true;
  const res = await getAnnouncementList(params.value);
  if (res.code === 200 && res.success) {
    renderList.value.push(...res.data.records);
    params.value.total = res.data.total;
  }
  loading.value = false;
};
</script>
<style lang="less" scoped>
.announcement-container {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 10rem;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0px;
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

.item-span {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #666666;
  font-size: 14px;
  white-space: nowrap;
  // flex: 1;
  width: 6rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
