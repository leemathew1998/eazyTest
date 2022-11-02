<template>
  <div class="coding-container">
    <codemirror
      v-model="examStore.answers['编程'][realCount].answer"
      :placeholder="placeholderLogo"
      :autofocus="true"
      style="min-height: 200px"
      :indent-with-tab="true"
      :tabSize="2"
      :extensions="extensions"
    />
    <el-button type="primary" size="default" class="m-2 absolute top-8 right-0" @click="runCode">运行</el-button>

    <el-select v-model="codeLanguage" class="m-2 absolute top-0 right-0" placeholder="请选择编程语言" size="small">
      <el-option label="JavaScript" value="JavaScript" />
      <el-option label="Java" value="Java" />
    </el-select>
  </div>
</template>
<script setup>
import { Codemirror } from "vue-codemirror";
import { placeholderLogo } from "@/utils/antiCheatingMethod.js";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ref, reactive, watch, computed } from "vue";
import { useExamStore } from "@/store";
import { ElMessage } from "element-plus";
const examStore = useExamStore();
const props = defineProps({
  record: Object,
});
const realCount = computed(() => {
  // 很无奈，主页面的count是递增的，store里面是按类别分的
  return (
    props.record.count -
    1 -
    Object.keys(examStore.answers["单选"]).length -
    Object.keys(examStore.answers["多选"]).length -
    Object.keys(examStore.answers["判断"]).length -
    Object.keys(examStore.answers["简答"]).length
  );
});
const runCode = () => {
  if (codeLanguage.value === "JavaScript") {
    examStore.runCodeIndex = realCount
  } else {
    ElMessage.warning("只支持JavaScript在线运行");
  }
};
const codeLanguage = ref();
const extensions = reactive([javascript(), oneDark]);
watch(
  () => codeLanguage.value,
  (value) => {
    // 保存已经写的数据
    extensions.shift();
    if (value === "JavaScript") {
      extensions.unshift(javascript());
    } else {
      extensions.unshift(java());
    }
  },
);
</script>
<style lang="less" scoped>
.coding-container {
  position: relative;
  .select {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
/deep/.el-input__wrapper {
  background-color: #292c34;
}
/deep/.el-select-dropdown {
  background-color: #292c34;
}
</style>
