<template>
  <BlankCardWithoutIcon>
    <template #title>
      <div class="qusetionTypeTitle w-full">
        {{ showTitle }}题（共10题，合计20分）
      </div>
    </template>
    <template #mainContent>
      <div class="answer-container">
        <!-- for loop start-->
        <div class="answers">
          <div
            v-for="(item, index) in questions"
            :key="`${item.type}-${item.count}`"
          >
            <div class="item-title">
              <span class="item-title-count">{{ item.count }}、</span>
              <span class="item-title-content">{{ item.content }}</span>
            </div>
            <div class="item-options">
              <!-- 需要在此处对选项进行调整 -->
              <component :is="stringMapInstance[item.type]"></component>
            </div>
          </div>
          <!-- 一直没有解决的高度问题 -->
          <div class="h-12"></div>
        </div>
      </div>
    </template>
  </BlankCardWithoutIcon>
</template>
<script setup>
import { ref } from "vue";
import { questions } from "./constants.js";
import BlankCardWithoutIcon from "./blankCardWithoutIcon.vue";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "./optionModules";

const showTitle = ref("单选");
const stringMapInstance = {
  单选: Radio,
  多选: CheckBox,
  简答: WriteDown,
  判断: Judge,
  编程: Coding,
};
</script>
<style lang="less" scoped>
.answer-container {
  min-height: 60vh;
  max-height: 80vh;
  .item-title {
    display: flex;
    flex-wrap: nowrap;
    .item-title-count {
      color: #31969a;
    }
    .item-title-content {
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #333333;
      text-align: left;
    }
  }
}
.qusetionTypeTitle {
  background-color: rgba(244, 253, 253, 1);
  font-size: 14px;
  color: #333333;
  text-align: left;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
