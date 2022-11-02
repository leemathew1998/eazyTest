<template>
  <div class="loop-container-monitor" ref="container">
    <div v-for="(item, index) in monitorList" :key="index" ref="items" class="item">
      <div class="relative mb-4">
        <img src="@/assets/image/u57.svg" alt="" />
        <img class="move-image" src="@/assets/image/u58.svg" alt="" />
      </div>
      <span class="item-title">{{ item.title }}</span>
      <span class="item-describe">{{ item.describe }}</span>
      <span class="item-describe">{{ item.time }}</span>
      <el-button @click="enterMonitor">进入监考</el-button>
    </div>
    <!--高度问题，未解决 -->
    <div class="h-24 w-full"></div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
const container = ref(null);
const items = ref(null);
onMounted(() => {
  /*
   *@Author: jkwei
   *@Date: 2022-11-02 09:44:59
   *@Description: 既要兼顾每一行，还要兼顾整体
   */
  if (monitorList.length > 0) {
    //总体宽度
    const containerWidth = container.value.clientWidth;
    //每一个元素宽度
    const itemWidth = items.value[0].clientWidth;
    //一行有多少个
    const rowCount = Math.floor(containerWidth / itemWidth);
    //剩余了多少px
    let leftWidth = containerWidth - itemWidth * rowCount;
    // 每一个margin是多少
    const oneItemMargin = leftWidth / (rowCount - 1);
    items.value.forEach((item, index) => {
      if ((index + 1) % 2 === 0) {
        //中间的那些，左右都要margin
        if ((index + 1) % rowCount === 0) {
          items.value[index].style.margin = `0.5rem 0px 0px ${oneItemMargin - 3}px `;
        } else {
          //每行中最后一个
          items.value[index].style.margin = `0.5rem ${oneItemMargin - 3}px 0px ${oneItemMargin - 3}px `;
        }
      }
    });
  }
});
/*
 *@Author: jkwei
 *@Date: 2022-10-25 10:38:47
 *@Description: fack list
 */
const enterMonitor = () => {
};
const monitorList = reactive([]);
for (let index = 0; index < 45; index++) {
  monitorList.push({
    title: "前端技术第九期测试",
    describe: "总分100分",
    time: "考试时长：60分钟",
  });
}
</script>
<style lang="less" scoped>
.loop-container-monitor {
  min-height: 70vh;
  max-height: 100vh;
  overflow-y: scroll;
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
    margin-top: 0.5rem;
    width: 12rem;
    height: 15rem;

    .move-image {
      position: absolute;
      top: 12px;
      left: 8px;
    }
    .item-title {
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
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
