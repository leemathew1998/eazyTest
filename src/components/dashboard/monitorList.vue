<template>
  <BasicCardVue>
    <template #title>在线考试列表</template>
    <template #mainContent>
      <div class="loop-container-monitor">
        <div v-for="(item, index) in monitorList" :key="index" class="item">
          <div class="relative mb-4">
            <img src="@/assets/image/u57.svg" alt="" />
            <img class="move-image" src="@/assets/image/u58.svg" alt="" />
          </div>
          <span class="item-title">{{ item.title }}</span>
          <span class="item-describe">{{ item.describe }}</span>
          <span class="item-describe">{{ item.time }}</span>
          <el-button @click="enterMonitor">进入监考</el-button>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive } from "vue";
import BasicCardVue from "../../components/basicCard.vue";
/*
 *@Author: jkwei
 *@Date: 2022-10-25 10:38:47
 *@Description: fack list
 */
const enterMonitor = () => {
  monitorList.push({
    title: "前端技术第九期测试",
    describe: "总分100分",
    time: "考试时长：60分钟",
  });
};
const monitorList = reactive([]);
for (let index = 0; index < 6; index++) {
  monitorList.push({
    title: "前端技术第九期测试",
    describe: "总分100分",
    time: "考试时长：60分钟",
  });
}
</script>
<style lang="less" scoped>
@itemMargin: 24px;
.loop-container-monitor {
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2em;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    background-color: rgba(49, 150, 154, 0.101960784313725);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(49, 150, 154, 1);
    border-radius: 3px;
    margin-right: @itemMargin;
    width: calc(25% - @itemMargin + @itemMargin / 4);
    // 此处及其优秀的css代码，既保证了margin的平均，
    // 还保证了一行没有四个还会保持正确的位置
    &:nth-child(4n + 4) {
      margin-right: 0;
    }
    &:nth-child(n + 5) {
      margin-top: 1em;
    }

    .move-image {
      position: absolute;
      top: 12px;
      left: 8px;
    }
    .item-title {
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium",
        "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-style: normal;
      font-size: 16px;
      text-align: center;
    }
    .item-describe {
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
