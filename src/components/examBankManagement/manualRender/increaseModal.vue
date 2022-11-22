<template>
  <el-dialog
    v-model="props.increaseModal"
    title="查看题目"
    width="53%"
    @closed="closeModal(ruleFormRef)"
    :destroyOnClose="true"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
      size="default"
      status-icon
      label-position="right"
    >
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="题目类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择题目类型" disabled>
              <el-option label="单选题" value="单选" />
              <el-option label="多选题" value="多选" />
              <el-option label="判断题" value="判断" />
              <el-option label="简答题" value="简答" />
              <el-option label="编程题" value="编程" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="题目难度" prop="level">
            <el-select v-model="ruleForm.level" placeholder="请选择题目难度" disabled>
              <el-option label="简单" value="1" />
              <el-option label="中等" value="2" />
              <el-option label="困难" value="3" />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select v-model="ruleForm.class" placeholder="请选择知识分类" disabled>
              <el-option label="前端" value="1" />
              <el-option label="后端" value="2" />
              <el-option label="设计" value="3" />
              <el-option label="测试" value="4" />
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="题目分数" prop="score">
            <el-input v-model.number="ruleForm.score" placeholder="请输入题目分数" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-row class="mb-4">
            <el-form-item label="题目内容" prop="content" v-if="questionType !== '编程'">
              <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入题目内容" :rows="4" disabled />
            </el-form-item>
            <el-form-item label="答案解析" prop="analysis" v-if="questionType === '编程'">
              <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" :rows="4" disabled />
            </el-form-item>
          </el-row>
          <el-row v-if="questionType && questionType !== '编程'">
            <el-form-item label="答案解析" prop="analysis">
              <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" :rows="4" disabled />
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12" :offset="0" :class="['mb-4']">
          <!-- 题目类型变化主要是调整这一块！ -->
          <el-form-item label="选项" prop="checkBoxList" v-if="questionType === '多选'">
            <el-checkbox-group v-model="ruleForm.checkBoxList">
              <el-row class="mb-2" v-for="item in radioList" :key="item.label">
                <el-col :span="6" class="flex items-center"
                  ><el-checkbox :label="item.label" :name="item.label" disabled
                /></el-col>
                <el-col :span="18">
                  <el-form-item :prop="item.option">
                    <el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="答案解析" prop="analysis" v-if="!questionType">
            <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" :rows="4" disabled />
          </el-form-item>
          <el-form-item label="选项" prop="radio" v-if="questionType === '单选'">
            <el-radio-group v-model="ruleForm.radio">
              <el-row class="mb-2" v-for="item in radioList" :key="item.label">
                <el-col :span="6" class="flex items-center">
                  <el-radio :label="item.label" :name="item.label" disabled />
                </el-col>
                <el-col :span="18">
                  <el-form-item :prop="item.option">
                    <el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选项" prop="isTure" v-if="questionType === '判断'">
            <!-- 判断题 -->
            <el-radio-group v-model="ruleForm.isTure" style="margin-left: 0" disabled>
              <el-radio label="正确" value="正确" />
              <el-radio label="错误" value="错误" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="正确答案" prop="writeContent" v-if="questionType === '简答'">
            <!-- 简答题 -->
            <el-input v-model="ruleForm.writeContent" type="textarea" placeholder="请输入正确答案" :rows="4" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="questionType === '编程'" class="mb-4"> </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end items-center -mt-4">
        <el-button @click.stop="closeModal(ruleFormRef)">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import {
  basicRules,
  radioMap,
  MultiRadioMap,
  ruleForm,
  reverseTtype,
  mapTtypes,
} from "@/components/questionBankManagement/constants.js";
import { addQuestion } from "@/api/questionBankManagement.js";
import { ElMessage } from "element-plus";
import { useUserStore, useExamStore } from "@/store";
import dayjs from "dayjs";
const examStore = useExamStore();
const userStore = useUserStore();
/*
 *@Author: jkwei
 *@Date: 2022-11-08 13:37:48
 *@Description: 此页面为新增题目，比较复杂！
 */
// 基本状态处理
const props = defineProps({
  increaseModal: Boolean,
  record: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  emit("update:increaseModal", false);
  (valueHtml.value = ""), (userCode.value = {});
  setTimeout(() => {
    formEl.resetFields();
    emit("update:record", {});
    for (let key in ruleForm) {
      ruleForm[key] = key != "checkBoxList" ? "" : [];
    }
  }, 300);
};
watch(
  () => props.increaseModal,
  (newVal) => {
    if (newVal && Object.keys(props.record).length > 0) {
      //修改信息
      nextTick(() => {
        ruleForm.type = mapTtypes[props.record.ttype];
        ruleForm.level = props.record.tdiff;
        ruleForm.class = props.record.knowGory;
        ruleForm.score = Number(props.record.score);
        ruleForm.content = props.record.tproblem;
        ruleForm.analysis = props.record.answerInfo;
        ruleForm.optionA = props.record.ta;
        ruleForm.optionB = props.record.tb;
        ruleForm.optionC = props.record.tc;
        ruleForm.optionD = props.record.td;
        ruleForm.optionE = props.record.te;
        ruleForm.optionF = props.record.tf;
        //特殊处理某些字段
        if (ruleForm.type === "单选") {
          ruleForm.radio = props.record.answer;
        } else if (ruleForm.type === "多选") {
          ruleForm.checkBoxList = props.record.answer.split("");
        } else if (ruleForm.type === "判断") {
          ruleForm.isTure = props.record.answer;
        } else if (ruleForm.type === "简答") {
          ruleForm.writeContent = props.record.answer;
        }
      });
    }
  },
);

// 定义各种form参数
const ruleFormRef = ref();
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
    } else if (newVal === "编程" && Object.keys(props.record).length === 0 && props.increaseModal) {
      //暂时先不设置弹出代码那块框,修改再说吧
      showCodeDrawer.value = true;
    }
  },
);
// 对代码题进行处理
const valueHtml = ref(); //template
const userCode = ref({});
const updateCodingInfo = () => {
  valueHtml.value = props.record.tproblem;
  userCode.value = JSON.parse(props.record.testOutput);
  const params = JSON.parse(props.record.testInput);
  for (let key in params) {
    userCode.value[key] = params[key];
  }
  showCodeDrawer.value = true;
};
</script>
<style lang="less" scoped>
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1);
  color: #fff;
}

/deep/.el-input__validateIcon {
  display: none;
}
:deep(.el-textarea) {
  width: 16rem !important;
  .el-textarea__inner {
    width: 16rem !important;
  }
}
:deep(.el-input) {
  width: 16rem !important;
  &__inner {
    width: 16rem !important;
  }
}
.scoreNumber {
  :deep(.el-input__wrapper) {
    margin-right: -14px !important;
  }
}
</style>
