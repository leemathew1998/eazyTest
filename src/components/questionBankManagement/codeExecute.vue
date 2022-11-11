<template>
  <el-drawer v-model="props.showCodeDrawer" direction="btt" size="100%" :show-close="false">
    <template #title class="mb-0">
      <h2 style="font-size: 20px; color: #303133">编辑代码题内容</h2>
    </template>
    <template #default>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <div style="border: 1px solid #ccc">
            <!-- <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="simple"
            /> -->
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="valueHtml"
              :defaultConfig="{ placeholder: placeholderLogo }"
              mode="simple"
              @onCreated="handleCreated"
            /></div
        ></el-col>
        <el-col :span="12" :offset="0" class="relative">
          <div class="flex fixed top-16">
            <el-select disabled v-model="codeLanguage" class="mr-2" placeholder="请对每一种编程语言规定初始函数体">
              <el-option label="JavaScript" value="JavaScript" />
              <el-option label="Java" value="Java" />
            </el-select>
            <el-button size="default" @click="codeExample">代码示例</el-button>
          </div>
          <codemirror
            v-model="userCode"
            :placeholder="placeholder"
            :style="{ height: '100%' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tabSize="2"
            :extensions="extensions"
          />
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <div class="flex justify-end items-center">
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="closeDrawer">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { toolbarConfig, template } from "./constants.js";
import { placeholderLogo } from "@/utils/antiCheatingMethod.js";
import { onBeforeUnmount, ref, reactive, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ElNotification } from "element-plus";
// 基本状态处理
const props = defineProps({
  showCodeDrawer: Boolean,
  valueHtml: String,
  userCode: String,
});
const emit = defineEmits();
const closeDrawer = () => {
  if(!userCode.value){
    ElNotification.error('请对代码题进行主函数编写！可点击代码示例进行生成！')
    return
  }
  ElNotification({
    title: "保存成功",
    type: "success",
  });
  emit("update:showCodeDrawer", false);
  emit("update:valueHtml", props.valueHtml);
  emit("update:userCode", userCode.value);
};
// 对代码区域进行设置
const placeholder = ref(`${placeholderLogo}
对JavaScript和Java编写相应的初始函数
`);
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
      temp_userCode["Java"] = userCode.value;
    } else {
      extensions.unshift(java());
      temp_userCode["JavaScript"] = userCode.value;
    }
    userCode.value = temp_userCode[value];
  },
);
const temp_userCode = {
  JavaScript: "",
  Java: "",
};
const userCode = ref("");
const codeExample = () => {
  // 给出示例代码，
  temp_userCode["JavaScript"] = `/**
* @param {number[]} nums
* @param {number} target
* @return {number[]}
*/
var twoSum = function(nums, target) {

};`;
  temp_userCode["Java"] = `class Solution {
  public int[] twoSum(int[] nums, int target) {

  }
}
`;
  userCode.value = codeLanguage.value === "JavaScript" ? temp_userCode["JavaScript"] : temp_userCode["Java"];
};

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
</style>
