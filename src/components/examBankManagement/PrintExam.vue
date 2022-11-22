<template>
  <el-dialog
    v-model="props.showExamModal"
    :title="title"
    width="43%"
    @closed="closeModal(false)"
    :destroy-on-close="true"
  >
    <component
      :is="componentName"
      @changeRenderComponent="changeRenderComponent"
      v-model:autoRenderForm="autoRenderForm"
      v-model:fatherUtils="fatherUtils"
    ></component>
    <template #footer v-if="title === '自动出卷'">
      <div class="flex justify-end">
        <el-button @click="closeModal(false)">取消</el-button>
        <el-button
          type="primary"
          @click="fatherClick"
          :loading="fatherUtils.status === 1"
          class="animated"
          ref="buttonRef"
          >生成试卷</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, shallowRef, reactive, watch } from "vue";
import RedOrBlue from "./redOrBlue.vue";
import AutoRender from "./AutoRender.vue";
import { useRouter } from "vue-router";
const router = useRouter();
// 状态参数
const props = defineProps({
  showExamModal: Boolean,
});
const emit = defineEmits();
const closeModal = (flag) => {
  emit("update:showExamModal", false);
  flag && emit("reLoadData", true);
  setTimeout(() => {
    componentName.value = RedOrBlue;
    title.value = "出卷方式选择";
    fatherUtils.status = 0;
  }, 300);
};

// 处理页面
const fatherUtils = reactive({
  status: 0,
});
watch(
  () => fatherUtils.status,
  (newVal, oldVal) => {
    if (newVal === 2) {
      closeModal(true);
    } else if (oldVal === 1 && newVal === 0) {
      if (buttonRef.value.ref.className.indexOf("shake") > -1) {
        const classs = buttonRef.value.ref.className
          .split(" ")
          .filter((item) => item != "shake")
          .join(" ");
        buttonRef.value.ref.className = classs;
      }
      setTimeout(() => {
        buttonRef.value.ref.className += " shake";
      }, 0);
    }
  },
);
const buttonRef = ref(null);
const buttonLoading = ref(false);
const fatherClick = () => {
  // 通知子组件父组件点击事件
  fatherUtils.status = 1;
};

// 自动出卷数据
const autoRenderForm = reactive({
  examName: "",
  count: 0,
  level: 0,
  totalScore: 0,
  quesTypes: [],
  class: [],
});
const title = ref("出卷方式选择");
const componentName = shallowRef(RedOrBlue);
// 提供给子组件修改组件
const changeRenderComponent = (payload) => {
  if (payload === "AutoRender") {
    title.value = "自动出卷";
    componentName.value = AutoRender;
  } else {
    // 如果选择手动出卷，需要跳转
    closeModal(false);
    router.push(`/exam/manualRenderPaper`);
  }
};
</script>
<style lang="less" scoped></style>
