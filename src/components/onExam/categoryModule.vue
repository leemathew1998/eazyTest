<template>
  <BasicCard>
    <template #title>
      <span class="">答题卡</span>
    </template>
    <template #mainContent>
      <div class="categoryList-container">
        <div v-for="(values, keys, mark) in examStore.answers" :key="keys">
          <span class="typeTitle" v-if="values.length > 0">{{ keys }}题（共{{ values.length }}题，合计xx分）</span>
          <!-- inside loop -->
          <div class="flex flex-wrap" v-if="values.length > 0">
            <p
              v-for="(item, index) in values"
              :key="`${keys}-${index}`"
              @click="jumpToCorrespondingLocation(`${keys}-${index}`)"
              :class="handleCodinglengthFix(item)"
            >
              {{ index + 1 }}
            </p>
          </div>
          <!-- 一直没有解决的高度问题 -->
          <div :class="Object.keys(examStore.answers).length - 1 === mark ? 'mb-10' : ''"></div>
          <el-divider style="margin: 0.5rem 0" v-if="values.length > 0" />
        </div>
      </div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "@/components/basicCard.vue";
import { useExamStore } from "@/store";
const examStore = useExamStore();
const jumpToCorrespondingLocation = (payload) => {
  const [title, count] = payload.split("-");
  examStore.clickItem.number = 1 + Number(count);
  examStore.clickItem.type = title;
};
//处理编程题本身就有数据的bug
const handleCodinglengthFix = (record) => {
  if (record.hasOwnProperty("length")) {
    return ["loopItem", record.length !== record.answer.length ? "finish" : ""];
  } else {
    return ["loopItem", record.answer.length > 0 ? "finish" : ""];
  }
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
    font-family: "SourceHanSansCN-Normal", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
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
