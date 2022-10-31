<template>
  <BlankCard>
    <template #mainContent>
      <div class="flex-col flex examScore-container mb-4">
        <div
          v-for="(item, index) in auditList"
          class="flex items-center justify-between m-2 shadow-md p-4 examScore-item"
        >
          <div class="flex flex-col">
            <h3 style="font-size: 18px">{{ item.title }}</h3>
            <template class="flex mt-4">
              <span class="item-lable mr-2">应考人数</span>
              <p class="m-auto whitespace-nowrap" style="color: #31969a">
                {{ item.expectNumber }}人
              </p>
              <span class="item-lable ml-4 mr-2">实考人数</span>
              <p class="m-auto whitespace-nowrap" style="color: red">{{ item.actualNumber }}人</p>
              <span class="item-lable ml-4 mr-2">平均分数</span>
              <p class="m-auto whitespace-nowrap" style="color: #0091FF;">{{ item.actualNumber }}人</p>
              <span class="item-lable ml-4 mr-2">考试状态</span>
              <p class="m-auto whitespace-nowrap" style="color: #999;">已阅卷</p>
              <span class="item-lable ml-4 mr-2">考试时间</span>
              <p class="m-auto whitespace-nowrap" style="color: #999;">2022-10-09 12:09:08</p>
            </template>
          </div>

          <el-button type="primary">查看</el-button>
        </div>
      </div>
    </template>
  </BlankCard>
</template>
<script setup>
import { reactive } from "vue";
import BlankCard from "@/components/blankCard.vue";
const auditList = reactive([]);
for (let index = 0; index < 20; index++) {
  auditList.push({
    title: "2022年第一季度前端测评",
    time: "开始时间：2022-10-24 09:00:00",
    expectNumber: 50,
    actualNumber: 46,
  });
}
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.examScore-container {
  .examScore-item {
    background-color: rgba(248, 248, 248, 1);
    border-radius: 8px;
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
</style>
