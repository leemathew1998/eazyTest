<template>
  <BasicCard>
    <template #title>
      <span class="">答题卡</span>
    </template>
    <template #mainContent>
      <div class="categoryList-container">
        <div v-for="(types, index) in renderList" :key="types.title">
          <span class="typeTitle">{{ types.title }}</span>
          <!-- inside loop -->
          <div class="flex flex-wrap">
            <p
              v-for="item in types.count"
              :key="`${types.title}-${item}`"
              @click="jumpToCorrespondingLocation(`${types.title}-${item}`)"
              :class="['loopItem', Math.random() > 0.5 ? 'finish' : '']"
            >
              {{ item }}
            </p>
          </div>
          <!-- 一直没有解决的高度问题 -->
          <div :class="renderList.length - 1 === index ? 'mb-10' : ''"></div>
          <el-divider style="margin: 0.5rem 0" />
        </div>
      </div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import { reactive } from "vue";
const renderList = reactive([
  {
    title: "单选题（共10题，合计20分）",
    count: 20,
  },
  {
    title: "多选题（共10题，合计20分）",
    count: 20,
  },
  {
    title: "简答题（共10题，合计20分）",
    count: 20,
  },
  {
    title: "判断题（共10题，合计20分）",
    count: 20,
  },
  {
    title: "编程题（共10题，合计20分）",
    count: 20,
  },
]);
const jumpToCorrespondingLocation = (payload) => {
  const [title, count] = payload.split("-");
};
</script>
<style lang="less" scoped>
.categoryList-container {
  min-height: 60vh;
  max-height: 80vh;
  .typeTitle {
    font-family: "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    white-space: nowrap;
    text-transform: none;
    font-size: 14px;
    color: #333333;
    text-align: left;
  }
  .loopItem {
    font-family: "SourceHanSansCN-Normal", "思源黑体 CN Normal", "思源黑体 CN",
      sans-serif;
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    border-width: 0px;
    border: none;
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    color: #d9d9d9;
    background-color: rgba(248, 248, 248, 1);
    border-color: rgba(204, 204, 204, 1);
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    width: 1.6rem;
    height: 1.3rem;
    text-align: center;
    margin: 0.5rem 0.5rem 0 0;
    cursor: pointer;
  }
  .finish {
    color: #ffffff;
    background-color: rgba(49, 150, 154, 1);
  }
}
</style>
