<template>
  <BasicCardVue>
    <template #title>在线考试</template>
    <template #topRight>
      <div class="rightLink">
        <a>查看公告</a>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </template>
    <template #mainContent>
      <div class="flex flex-col">
        <!-- loop -->
        <div v-for="item in renderList" :key="item.index">
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center mb-4">
                <span class="examName">{{ item.examName }}</span>
                <span class="type" :style="{ backgroundColor: item.type === '可参加' ? '#45D6B6' : '#F7B502' }">{{
                  item.type
                }}</span>
              </div>
              <span class="timeRanges">{{ item.timeRanges }}</span>
            </div>
            <el-button type="primary" size="default">进入</el-button>
          </div>
          <el-divider direction="horizontal" content-position="center"></el-divider>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive } from "vue";
const renderList = reactive([]);
for (let i = 0; i < 20; i++) {
  renderList.push({
    index: i,
    examName: "2022年前端技术10月考试",
    timeRanges: "2022-10-25 12:30:00-13:30:00",
    type: Math.random() > 0.5 ? "可参加" : "未参加",
  });
}
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
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
}
.timeRanges {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #333333;
  text-align: left;
}
/deep/.el-divider--horizontal {
  margin: 8px 0px;
}
</style>
