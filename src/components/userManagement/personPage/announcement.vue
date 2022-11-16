<template>
  <BasicCardVue>
    <template #title>我的公告</template>
    <template #mainContent>
      <div class="announcement-container">
        <!-- start loop -->
        <div v-for="item in renderList" :key="item.index" class="flex justify-between mb-2 w-full">
          <div class="flex">
            <span class="item-span">{{ item.examName }}</span>
            <span class="item-span">{{ item.score }}</span>
            <span class="item-span">{{ item.averageScore }}</span>
            <span class="item-span">{{ item.rank }}</span>
            <span class="item-span">{{ item.info }}</span>
          </div>
          <div class="rightLink" @click="openModal(item)">
            <a>查看试卷详情</a>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive, onMounted, ref } from "vue";
import { getAnnouncementList } from "@/api/userManagement.js";
import { useUserStore } from "@/store";
import lodash from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
const userStore = useUserStore();
const renderList = reactive([]);
onMounted(async () => {
  window.addEventListener("scroll", lodash.throttle(handlerHeight, 300), true);
  // loadList();
});
//检测是不是滑到最底下了
const handlerHeight = () => {
  const scrollTop = document.getElementsByClassName("announcement-container")[0]?.scrollTop;
  const clientHeight = document.getElementsByClassName("announcement-container")[0]?.clientHeight;
  const scrollHeight = document.getElementsByClassName("announcement-container")[0]?.scrollHeight;
  if (scrollTop + clientHeight === scrollHeight - 50) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
    }
  }
};
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
  pageNo: "1",
  pageSize: "10",
});
const loadList = async () => {
  const res = await getAnnouncementList();
  console.log(res);
};
for (let i = 0; i < 50; i++) {
  renderList.push({
    index: i,
    examName: "前端技术第三季度考试" + i,
    score: "97分",
    averageScore: "平均分86分",
    rank: "第2名",
    info: "共50人参考",
  });
}
</script>
<style lang="less" scoped>
.announcement-container {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 10rem;
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
  margin-right: 1rem;
  white-space: nowrap;
  flex: 1;
}
</style>
