<template>
  <el-dialog
    v-model="props.increaseModal"
    title="新增题目"
    width="60%"
    @closed="closeModal(ruleFormRef)"
    :destroyOnClose="true"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
      label-position="left"
    >
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="题目类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择题目类型">
              <el-option label="单选" value="单选" />
              <el-option label="多选" value="多选" />
              <el-option label="判断" value="判断" />
              <el-option label="简答" value="简答" />
              <el-option label="编程" value="编程" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="题目难度" prop="level">
            <el-select v-model="ruleForm.level" placeholder="请选择题目难度">
              <el-option label="简单" value="简单" />
              <el-option label="中等" value="中等" />
              <el-option label="困难" value="困难" />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select v-model="ruleForm.class" placeholder="请选择知识分类">
              <el-option label="开发相关" value="开发相关" />
              <el-option label="算法相关" value="算法相关" />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="题目分数" prop="score">
            <el-input v-model.number="ruleForm.score" placeholder="请输入题目分数" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-row class="mb-4">
            <el-form-item label="答案解析" prop="analysis" v-if="questionType === '编程'">
              <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" />
            </el-form-item>
            <el-form-item v-else label="题目内容" prop="content">
              <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入题目内容" />
            </el-form-item>
          </el-row>
          <el-row v-if="questionType && questionType !== '编程'">
            <el-form-item label="答案解析" prop="analysis">
              <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" />
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12" :offset="0" :class="['mb-4']">
          <!-- 题目类型变化主要是调整这一块！ -->
          <el-form-item label="选项" prop="checkBoxList" v-if="questionType === '多选'">
            <el-checkbox-group v-model="ruleForm.checkBoxList">
              <el-row class="mb-2" v-for="item in radioList" :key="item.label">
                <el-col :span="6"><el-checkbox :label="item.label" :name="item.label" /></el-col>
                <el-col :span="18"><el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" /></el-col>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="答案解析" prop="analysis" v-if="!questionType">
            <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" />
          </el-form-item>
          <el-form-item label="选项" prop="radio" v-if="questionType === '单选'">
            <el-radio-group v-model="ruleForm.radio">
              <el-row class="mb-2" v-for="item in radioList" :key="item.label">
                <el-col :span="6">
                  <el-radio :label="item.label" :name="item.label" />
                </el-col>
                <el-col :span="18"><el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" /></el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选项" prop="isTure" v-if="questionType === '判断'">
            <!-- 判断题 -->
            <el-radio-group v-model="ruleForm.isTure" style="margin-left: 0">
              <el-radio label="正确" value="正确" />
              <el-radio label="错误" value="错误" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="正确答案" prop="writeContent" v-if="questionType === '简答'">
            <!-- 简答题 -->
            <el-input v-model="ruleForm.writeContent" type="textarea" placeholder="请输入正确答案" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="questionType === '编程'" class="mb-4">
        <CodeExecute
          v-model:showCodeDrawer="showCodeDrawer"
          v-model:valueHtml="valueHtml"
          v-model:userCode="userCode"
        ></CodeExecute>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end items-center">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed, nextTick } from "vue";
import { parseHtml } from "@/utils/methods.js";
import { basicRules, radioMap, MultiRadioMap, template } from "./constants.js";
import CodeExecute from "./codeExecute.vue";
// 基本状态处理
const props = defineProps({
  increaseModal: Boolean,
  record: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  formEl.resetFields();
  emit("update:increaseModal", false);
  emit("update:record", {});
};
watch(
  () => props.increaseModal,
  (newVal) => {
    if (newVal && Object.keys(props.record).length > 0) {
      ruleForm.type = props.record.type;
      ruleForm.level = props.record.level;
      ruleForm.class = props.record.class;
      ruleForm.content = props.record.content;
    } else {
      ruleForm.type = "";
      ruleForm.level = "";
      ruleForm.class = "";
      ruleForm.content = "";
    }
  },
);

// 定义各种form参数
const formSize = ref("default");
const ruleFormRef = ref();
const ruleForm = reactive({
  type: "", //类型
  level: "", //难度
  class: "", //分类
  content: "", //内容
  checkBoxList: [], //多选
  radio: "", //单选
  isTure: "", // 判断
  writeContent: "", //简答
  score: null, //分数
  analysis: "", //答案解析
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  optionE: "",
  optionF: "",
});
const radioList = reactive([]);
// 此处时基础规则，如果改变了的话还需要动态调整
const rules = reactive(basicRules);
const questionType = ref();
const showCodeDrawer = ref(false);
// 开始监控选项动态调整
watch(
  () => ruleForm.type,
  (newVal) => {
    // 单选多选先清空，然后追加相应的选项，判断题直接
    while (radioList.length) {
      radioList.pop();
    }
    questionType.value = newVal;
    if (newVal === "单选") {
      radioMap.forEach((item) => {
        radioList.push(item);
      });
    } else if (newVal === "多选") {
      MultiRadioMap.forEach((item) => {
        radioList.push(item);
      });
    } else if (newVal === "编程") {
      showCodeDrawer.value = true;
    }
  },
);
// 对代码题进行处理
const valueHtml = ref(template);
const userCode = ref("");
// 开始监听showCodeDrawer关闭状态
watch(
  () => showCodeDrawer.value,
  (newVal) => {
    if (!newVal) {
      console.log("关闭了，开始处理参数", parseHtml(valueHtml.value));
    }
  },
);

// 此处单选和多选都是用的多选框，需要处理一下单选只能选择一个
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!", ruleForm);
      console.log();
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1);
  color: #fff;
}
/deep/.el-form-item__content {
  width: 16rem;
}
/deep/.el-input__wrapper {
  width: 16rem;
}
/deep/.el-input__inner {
  width: 16rem;
}
/deep/.el-input--default {
  width: 16rem;
}
/deep/.el-textarea__inner {
  width: 16rem;
}
/deep/.el-checkbox-group {
  margin-left: -4.5rem;
}
/deep/.el-radio-group {
  margin-left: -4.5rem;
}
/deep/.el-form-item__content {
}
/deep/.el-input__validateIcon {
  display: none;
}
</style>
