<template>
  <BlankCard>
    <template #mainContent>
      <div class="loop-container-watch">
        <div v-for="item in watchList" :key="item.streamId" class="item-container">
          <div class="item">
            <img src="@/assets/image/u1445.png" alt="" class="item-image" />
            <div class="item-bottom">
              <span class="item-bottom-name">{{ item.username }}</span>
              <el-button @click="">查 看</el-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BlankCard>
</template>
<script setup>
import { reactive } from "vue";
import BlankCard from "@/components/blankCard.vue";
/*
 *@Author: jkwei
 *@Date: 2022-10-25 10:38:47
 *@Description: fack list
 */
const watchList = reactive([]);
for (let i = 0; i < 7; i++) {
  watchList.push({
    streamId: Math.random() * 100,
    username: Math.floor(Math.random() * 100),
  });
}
</script>
<style lang="less" scoped>
.loop-container-watch {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: scroll;
  min-height: 40vh;
  max-height: 50vh;
  .item-container {
    flex: 1;
    display: flex;

    margin-bottom: 1rem;
    .item {
      justify-content: center;
      .item-image {
        min-width: 12rem;
        max-width: 15rem;
      }
      .item-bottom {
        min-width: 12rem;
        max-width: 15rem;
        left: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 1);
        padding: 4px 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .item-bottom-name {
        font-family: "思源黑体 CN", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
/deep/.el-button {
  height: 24px;
  border: none;
  background-color: #fff;
  border-radius: 16px;
  color: #000;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
}
</style>
