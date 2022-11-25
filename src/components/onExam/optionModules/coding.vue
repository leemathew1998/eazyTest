<template>
  <div class="coding-container">
    <div>
      <codemirror
        v-model="
          examStore.answers['编程'][props.innerIndex].answer[
            examStore.answers['编程'][props.innerIndex].defaultCodeLanguage
          ]
        "
        :placeholder="placeholderLogo"
        :autofocus="true"
        style="min-height: 200px"
        :indent-with-tab="true"
        :tabSize="2"
        :extensions="extensions"
        :disabled="props.disable"
      />
    </div>
    <el-select
      v-model="codeLanguage"
      style="position: absolute"
      class="m-2 top-0 right-0"
      placeholder="请选择编程语言"
      size="small"
      v-if="!props.disable"
    >
      <el-option label="JavaScript" value="JavaScript" />
      <el-option label="Java" value="Java" />
    </el-select>
    <el-button
      v-if="!props.disable"
      type="primary"
      size="default"
      class="m-2 absolute top-8 right-0"
      @click="runCodeForJS"
      >运行</el-button
    >
  </div>
</template>
<script setup>
import { Codemirror } from "vue-codemirror";
import { placeholderLogo } from "@/utils/antiCheatingMethod.js";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ref, reactive, watch } from "vue";
import { useExamStore } from "@/store";
import { ElMessage } from "element-plus";
import { runCode } from "../methods.js";
const examStore = useExamStore();
const props = defineProps({
  innerIndex: String | Number,
  record: Object,
  disable: {
    type: Boolean,
    default: false,
  },
});
const runCodeForJS = () => {
  if (codeLanguage.value === "JavaScript") {
    examStore.runCodeIndex = props.innerIndex;
    runCode(false);
  } else {
    ElMessage.warning("只支持JavaScript在线运行");
  }
};
const codeLanguage = ref("JavaScript");
const extensions = reactive([javascript(), oneDark]);
watch(
  () => codeLanguage.value,
  (value) => {
    examStore.answers["编程"][props.innerIndex].defaultCodeLanguage = value;
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
  padding-left: 1px;
}
/deep/.el-input__wrapper {
  background-color: #292c34;
}
/deep/.el-select-dropdown {
  background-color: #292c34;
}
</style>
