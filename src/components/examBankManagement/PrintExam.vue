<template>
  <el-dialog v-model="props.showExamModal" :title="title" width="50%" @closed="closeModal" :destroy-on-close="true">
    <component
      :is="componentName"
      @changeRenderComponent="changeRenderComponent"
      v-model:autoRenderForm="autoRenderForm"
      v-model:fatherHasClick="fatherHasClick"
    ></component>
    <template #footer v-if="title === '自动出卷'">
      <div class="flex justify-end">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="fatherClick">{{ footerClickTitle }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, shallowRef, reactive } from "vue";
import RedOrBlue from "./redOrBlue.vue";
import AutoRender from "./AutoRender.vue";
import { useRouter } from "vue-router";
const router = useRouter();
// 状态参数
const props = defineProps({
  showExamModal: Boolean,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:showExamModal", false);
  setTimeout(() => {
    componentName.value = RedOrBlue;
    title.value = "出卷方式选择";
  }, 300);
};

// 处理页面
const footerClickTitle = ref("生成试卷");
const fatherClick = () => {
  if (footerClickTitle.value === "确定") {
    closeModal();
  }
  // 通知子组件父组件点击事件
  footerClickTitle.value = "确定";
  fatherHasClick.value = !fatherHasClick.value;
};
const fatherHasClick = ref(false);
// 自动出卷数据
const autoRenderForm = reactive({
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
  title.value = payload === "AutoRender" ? "自动出卷" : "";
  componentName.value = payload === "AutoRender" ? AutoRender : RedOrBlue;
  // 如果选择手动出卷，需要跳转
  closeModal();
  router.push("/exam/manualRenderPaper");
};
</script>
<style lang="less" scoped></style>
