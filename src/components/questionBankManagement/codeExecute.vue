<template>
  <el-drawer v-model="props.showCodeDrawer" direction="btt" size="100%" :show-close="false">
    <template #title class="mb-0">
      <h2 style="font-size: 20px; color: #303133">编辑代码题内容</h2>
    </template>
    <template #default>
      <el-row :gutter="20" class="h-full overflow-hidden">
        <el-col :span="12" :offset="0" class="h-full">
          <el-row :gutter="20" class="w-full h-full">
            <div style="border: 1px solid #ccc" class="editor-container">
              <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" mode="simple" />
              <Editor
                v-model="valueHtml"
                :defaultConfig="{ placeholder: '在此处编写编程题内容...' }"
                mode="simple"
                @onCreated="handleCreated"
              />
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" :offset="0" class="flex flex-col" style="display: flex; flex-direction: column">
          <el-row :gutter="20" class="relative w-full" style="flex: 1">
            <div class="flex fixed top-16">
              <el-select v-model="codeLanguage" class="mr-2" placeholder="请对每一种编程语言规定初始函数体">
                <el-option label="JavaScript" value="JavaScript" />
                <el-option label="Java" value="Java" />
              </el-select>
            </div>
            <codemirror
              v-model="userCode[codeLanguage]"
              placeholder="在此处编写主函数代码..."
              :style="{ height: '100%', width: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tabSize="2"
              :extensions="extensions"
            />
          </el-row>
          <el-row :gutter="20" style="flex: 1">
            <Carousel @renderCodeArea="renderCodeArea" ref="carouselRef"></Carousel>
          </el-row>
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <div class="flex justify-end items-center">
        <el-button @click="closeDrawer(true)">取消</el-button>
        <el-button type="primary" @click="closeDrawer(false)" ref="buttonRef" class="animated">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { toolbarConfig } from "./constants.js";
import { onBeforeUnmount, ref, reactive, shallowRef, watch, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ElNotification } from "element-plus";
import Carousel from "./carousel.vue";

// 基本状态处理
const props = defineProps({
  showCodeDrawer: Boolean,
  valueHtml: String,
  userCode: String,
});
const emit = defineEmits();
const buttonRef = ref();
const carouselRef = ref();
const closeDrawer = (flag = false) => {
  if (flag) {
    emit("update:showCodeDrawer", false);
    return;
  }
  if (userCode.Java === "" || userCode.JavaScript === "") {
    ElNotification.error("请对代码题进行主函数编写！");
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
    return;
  }
  ElNotification({
    title: "保存成功",
    type: "success",
  });
  emit("update:showCodeDrawer", false);
  emit("update:valueHtml", props.valueHtml);
  emit("update:userCode", userCode);
};
// 对代码区域进行设置
// 语言不同，他启动的主函数也不同。
const codeLanguage = ref();
codeLanguage.value = "JavaScript";
let extensions = reactive([javascript(), oneDark]);
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
//处理子组件给的参数，渲染代码区域
const renderCodeArea = (record) => {
  userCode.JavaScript = record.JavaScript;
  userCode.Java = record.Java;
};
const userCode = reactive({
  JavaScript: "",
  Java: "",
});

// 对富文本区域进行处理
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="less" scoped>
.editor-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

/deep/.el-drawer__header {
  margin-bottom: 0px !important;
}
/deep/.el-drawer__body {
  padding-top: 0px;
}
/deep/.el-input__wrapper {
  width: 12rem !important;
}
/deep/.el-input--default {
  width: 12rem !important;
}
/deep/.el-input__inner {
  width: 12rem !important;
}
.toolbar {
  border-bottom: 1px solid #ccc;
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>
