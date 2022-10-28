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
            :class="[`${item.type}-${item.count}`, `${item.type}`]"
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
          <div class="h-12 mark"></div>
        </div>
      </div>
    </template>
  </BlankCardWithoutIcon>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { questions } from "./constants.js";
import BlankCardWithoutIcon from "./blankCardWithoutIcon.vue";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "./optionModules";
import lodash from "lodash";
const showTitle = ref("单选");
const stringMapInstance = {
  单选: Radio,
  多选: CheckBox,
  简答: WriteDown,
  判断: Judge,
  编程: Coding,
};
const mapEl = [];
const indexMapToTitle = ["单选", "多选", "简答", "判断", "编程"];
function handleScroll() {
  const nowScrollTop =
    document.getElementsByClassName("answer-container")[0].scrollTop;
  for (let index = 0; index < mapEl.length; index++) {
    if (nowScrollTop < mapEl[index + 1] && nowScrollTop > mapEl[index]) {
      showTitle.value = indexMapToTitle[index];
      break;
    }
  }
}
onMounted(() => {
  /*
     *@Author: jkwei
     *@Date: 2022-10-28 10:13:26
     *@Description: 初步想法是在此处获取到每种题目单个的高度，然后监听滚动高度，看看是不是到达？
     假设每种题目20道
    */
  const radioHeight = document.getElementsByClassName("单选")[0].offsetHeight; //单个题目高度
  const checkBoxHeight =
    document.getElementsByClassName("多选")[0].offsetHeight; //单个题目高度
  const JudgeHeight = document.getElementsByClassName("判断")[0].offsetHeight; //单个题目高度
  const writeDownHeight =
    document.getElementsByClassName("简答")[0].offsetHeight; //单个题目高度
  const codingHeight = document.getElementsByClassName("编程")[0].offsetHeight; //单个题目高度
  const el = document.getElementsByClassName("answer-container")[0];
  mapEl.push(0);
  mapEl.push(radioHeight * 20);
  mapEl.push(radioHeight * 20 + checkBoxHeight * 20);
  mapEl.push(radioHeight * 20 + checkBoxHeight * 20 + JudgeHeight * 20);
  mapEl.push(
    radioHeight * 20 +
      checkBoxHeight * 20 +
      JudgeHeight * 20 +
      writeDownHeight * 20
  );
  mapEl.push(
    radioHeight * 20 +
      checkBoxHeight * 20 +
      JudgeHeight * 20 +
      writeDownHeight * 20 +
      codingHeight * 20
  );
  //举个例子：[0, 3040, 7360, 9120, 11900, 16180] 16227
  el.addEventListener("scroll", lodash.throttle(handleScroll, 200), false);
});
</script>
<style lang="less" scoped>
.answer-container {
  min-height: 60vh;
  overflow-y: scroll;
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
