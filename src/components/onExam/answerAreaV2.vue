<template>
  <BlankCardWithoutIcon>
    <template #title>
      <div class="qusetionTypeTitle">{{ showTitle }}</div>
    </template>
    <template #mainContent>
      <div class="answer-container">
        <el-carousel class="w-full h-full" trigger="click" indicator-position="none" always="never" :autoplay="false"
          :loop="false" ref="carouselRef" height="100%" @change="changeCarousel">
          <template v-for="(items, type) in props.questions.value" :key="type">
            <el-carousel-item class="h-full" style="width: 99%" :name="`${type}-${index}`"
              v-for="(item, index) in items" :key="index">
              <div class="item-title">
                <span class="item-title-count">{{ item.count }}、</span>
                <span class="item-title-content" v-if="type !== '编程'">{{ item.tproblem }}</span>
                <span class="item-title-content" v-else v-html="item.tproblem"></span>
              </div>
              <div class="item-options">
                <component :is="stringMapInstance[item.ttype]" :innerIndex="index" :record="item"></component>
              </div>
            </el-carousel-item>
          </template>
        </el-carousel>
      </div>
    </template>
  </BlankCardWithoutIcon>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref, watch, onBeforeUnmount } from "vue";
import BlankCardWithoutIcon from "./blankCardWithoutIcon.vue";
import { Radio, CheckBox, WriteDown, Judge, Coding } from "./optionModules";
import { useExamStore, useUserStore } from "@/store";
import emiter from "@/utils/mitt.js";
let isCodingQuestion = false
const examStore = useExamStore();
const props = defineProps({
  questions: Object,
});
//全屏以后高度会发生变化，需要再次调整！
let flag = false;
emiter.on("startFullscreen", (e) => {
  if (flag) return;
  const root = document.getElementsByClassName("answer-container")[0];
  root.style.height = `${root.clientHeight + 80}px`;
  flag = true;
});
onBeforeUnmount(() => {
  emiter.off("startFullscreen");
});
const showTitle = ref(``);
const changeCarousel = (index) => {
  //幻灯片索引改变时，改变题目类型，从0开始
  if (index + 1 <= examStore.answers["单选"].length) {
    showTitle.value = `单选题（共${examStore.answers["单选"].length}题）`;
  } else if (index + 1 <= examStore.answers["单选"].length + examStore.answers["多选"].length) {
    showTitle.value = `多选题（共${examStore.answers["多选"].length}题）`;
  } else if (
    index + 1 <=
    examStore.answers["单选"].length + examStore.answers["多选"].length + examStore.answers["判断"].length
  ) {
    showTitle.value = `判断题（共${examStore.answers["判断"].length}题）`;
  } else if (
    index + 1 <=
    examStore.answers["单选"].length +
    examStore.answers["多选"].length +
    examStore.answers["判断"].length +
    examStore.answers["简答"].length
  ) {
    showTitle.value = `简答题（共${examStore.answers["简答"].length}题）`;
  } else if (
    index + 1 <=
    examStore.answers["单选"].length +
    examStore.answers["多选"].length +
    examStore.answers["判断"].length +
    examStore.answers["编程"].length +
    examStore.answers["简答"].length
  ) {
    showTitle.value = `编程题（共${examStore.answers["编程"].length}题）`;
    isCodingQuestion = true;
  }
};
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
    // 需要跳转到的题目的索引
    carouselRef.value.setActiveItem(`${newVal.type}-${newVal.number}`);
  },
  { deep: true },
);
//处理点击下一个按钮切换题目
const carouselRef = ref(null);
onMounted(() => {
  changeCarousel(0)
});
// 检测键盘
window.onkeydown = function (event) {
  if (event.keyCode == 13) {
    //需要看一下是不是编程题，如果是编程题就不要切换了
    isCodingQuestion ? null : carouselRef.value.next();
  }
};
</script>
<style lang="less" scoped>
.answer-container {
  overflow-y: scroll;
  height: 100%;
  position: relative;

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
  width: 100%;
}
</style>
