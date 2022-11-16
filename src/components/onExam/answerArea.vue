<template>
  <BlankCardWithoutIcon>
    <template #title>
      <div class="qusetionTypeTitle w-full">{{ showTitle }}</div>
    </template>
    <template #mainContent>
      <div class="answer-container" @click="test">
        <!-- for loop start-->
        <div class="answers">
          <div v-for="(items, index) in answers.value" :key="index">
            <!-- inner loop -->
            <div v-for="(item, i) in items" :key="`${index}-${i}`" :class="[`${index}-${i}`, `${index}`]">
              <div class="item-title">
                <span class="item-title-count">{{ item.count }}、</span>
                <span class="item-title-content" v-if="index !== '编程'">{{ item.tproblem }}</span>
                <span class="item-title-content" v-else v-html="item.tproblem"></span>
              </div>
              <div class="item-options">
                <!-- 需要在此处对选项进行调整 -->
                <component :is="stringMapInstance[item.ttype]" :innerIndex="i" :record="item"></component>
              </div>
            </div>
          </div>
          <!-- 一直没有解决的高度问题 -->
          <div class="h-2"></div>
        </div>
      </div>
    </template>
  </BlankCardWithoutIcon>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { indexMapToTitle } from "./constants.js";
import BlankCardWithoutIcon from "./blankCardWithoutIcon.vue";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "./optionModules";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { useExamStore, useUserStore } from "@/store";
const examStore = useExamStore();
const userStore = useUserStore();
const route = useRoute();
const props = defineProps({
  questions: Object,
});
const showTitle = ref(`单选题（共${examStore.answers["单选"].length}题）`);
const stringMapInstance = {
  1: Radio,
  2: CheckBox,
  3: Judge,
  4: WriteDown,
  5: Coding,
};

// 处理题目左侧点击然后主答题区域滚动到相应位置
watch(
  () => examStore.clickItem,
  (newVal, oldVal) => {
    // 需要跳转
    scrollToLocation();
  },
  { deep: true },
);
const scrollToLocation = () => {
  const root = document.getElementsByClassName("answer-container")[0];
  if (examStore.clickItem.type === "单选") {
    root.scrollTop = radioHeight * (examStore.clickItem.number - 1);
  } else if (examStore.clickItem.type === "多选") {
    root.scrollTop = mapEl[1] + checkBoxHeight * (examStore.clickItem.number - 1);
  } else if (examStore.clickItem.type === "判断") {
    root.scrollTop = mapEl[1] + mapEl[2] + JudgeHeight * (examStore.clickItem.number - 1);
  } else if (examStore.clickItem.type === "简答") {
    root.scrollTop = mapEl[1] + mapEl[2] + mapEl[3] + writeDownHeight * (examStore.clickItem.number - 1);
  } else if (examStore.clickItem.type === "编程") {
    root.scrollTop = mapEl[1] + mapEl[2] + mapEl[3] + mapEl[4] + codingHeight * (examStore.clickItem.number - 1);
  }
};
// 处理滚动改变title
const mapEl = [];

function handleScroll() {
  const nowScrollTop = document.getElementsByClassName("answer-container")[0]?.scrollTop;
  for (let index = 0; index < mapEl.length; index++) {
    if (nowScrollTop < mapEl[index + 1] && nowScrollTop > mapEl[index]) {
      showTitle.value = `${indexMapToTitle[index]}题（共${examStore.answers[indexMapToTitle[index]].length}题）`;
      break;
    }
  }
}
const test = () => {
  //固定容器高度
  const root = document.getElementsByClassName("answer-container")[0];
  // root.style.height = `${root.clientHeight}px`;
  console.log(root.clientHeight, root.offsetHeight, root.scrollHeight);
};
//单个题目高度
let radioHeight = 0;
let checkBoxHeight = 0;
let JudgeHeight = 0;
let writeDownHeight = 0;
let codingHeight = 0;
const answers = reactive({ value: [] });
onMounted(() => {
  setTimeout(()=>{
    test()
  },1000)
  //使用内部变量接收props
  // answers.value = props.questions.value;
  /*
	*@Author: jkwei
	*@Date: 2022-10-28 10:13:26
	*@Description: 初步想法是在此处获取到每种题目单个的高度，然后监听滚动高度，看看是不是到达？
	但是此处还有问题，由于渲染很慢，导致在此处仍然有可能无法获取到dom
	*/
  setTimeout(() => {
    radioHeight = document.getElementsByClassName("单选")[0]?.offsetHeight; //单个题目高度
    checkBoxHeight = document.getElementsByClassName("多选")[0]?.offsetHeight; //单个题目高度
    JudgeHeight = document.getElementsByClassName("判断")[0]?.offsetHeight; //单个题目高度
    writeDownHeight = document.getElementsByClassName("简答")[0]?.offsetHeight; //单个题目高度
    codingHeight = document.getElementsByClassName("编程")[0]?.offsetHeight; //单个题目高度
    const el = document.getElementsByClassName("answer-container")[0];
    mapEl.push(0);
    mapEl.push(radioHeight * examStore.answers["单选"].length);
    mapEl.push(mapEl[1] + checkBoxHeight * examStore.answers["多选"].length);
    mapEl.push(mapEl[2] + JudgeHeight * examStore.answers["判断"].length);
    mapEl.push(mapEl[3] + writeDownHeight * examStore.answers["简答"].length);
    mapEl.push(mapEl[4] + +codingHeight * examStore.answers["判断"].length);
    //举个🌰子：[0, 3040, 7360, 9120, 11900, 16180] 16227
    el.addEventListener("scroll", lodash.throttle(handleScroll, 200), false);
  }, 3000);
});
</script>
<style lang="less" scoped>
.answer-container {
  overflow-y: scroll;
  height: 100%;

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
      width: 100%;
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
