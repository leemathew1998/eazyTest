<template>
  <BasicCardVue>
    <template #title>我的公告</template>
    <template #topRight>
      <div class="rightLink">
        <a>查看公告</a>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </template>
    <template #mainContent>
      <div class="announcement-container">
        <div class="test">
          <!-- start loop -->
          <div v-for="item in renderList" :key="item.index" class="flex justify-between mb-2 w-full">
            <div class="flex">
              <span class="item-span">{{ item.examName }}</span>
              <span class="item-span">{{ item.score }}</span>
              <span class="item-span">{{ item.averageScore }}</span>
              <span class="item-span">{{ item.rank }}</span>
              <span class="item-span">{{ item.info }}</span>
            </div>
            <div class="rightLink">
              <a>查看试卷详情</a>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive } from "vue";
const renderList = reactive([]);
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
  overflow: hidden;
  height: 10rem;
  .test {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    overflow: scroll;
    width: 100%;
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
  margin-right: 1rem;
  white-space: nowrap;
  flex: 1;
}
</style>
