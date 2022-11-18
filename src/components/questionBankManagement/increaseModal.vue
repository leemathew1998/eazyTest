<template>
  <el-dialog
    v-model="props.increaseModal"
    :title="Object.keys(props.record).length > 0 ? '修改题目' : '新增题目'"
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
            <el-select v-model="ruleForm.level" placeholder="请选择题目难度">
              <el-option label="简单" value="1" />
              <el-option label="中等" value="2" />
              <el-option label="困难" value="3" />
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select v-model="ruleForm.class" placeholder="请选择知识分类">
              <el-option label="前端" value="1" />
              <el-option label="后端" value="2" />
              <el-option label="设计" value="3" />
              <el-option label="测试" value="4" />
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
            <el-form-item label="题目内容" prop="content" v-if="questionType !== '编程'">
              <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入题目内容" />
            </el-form-item>
            <el-form-item label="答案解析" prop="analysis" v-if="questionType === '编程'">
              <el-input v-model="ruleForm.analysis" type="textarea" placeholder="请输入答案分析" />
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
                <el-col :span="18">
                  <el-form-item :prop="item.option">
                    <el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" />
                  </el-form-item>
                </el-col>
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
                <el-col :span="18">
                  <el-form-item :prop="item.option">
                    <el-input v-model="ruleForm[item.option]" placeholder="请输入选项内容" />
                  </el-form-item>
                </el-col>
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
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="buttonLoading"
          ref="buttonRef"
          class="animated"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { basicRules, radioMap, MultiRadioMap, ruleForm } from "./constants.js";
import CodeExecute from "./codeExecute.vue";
import { addQuestion } from "@/api/questionBankManagement.js";
import { reverseTtype, mapRuleForm, mapTtypes } from "./constants.js";
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

  (valueHtml.value = ""), (userCode.value = "");
  nextTick(() => {
    emit("update:record", {});
    formEl.resetFields();
  });
};
watch(
  () => props.increaseModal,
  (newVal) => {
    if (newVal && Object.keys(props.record).length > 0) {
      //修改信息
      ruleForm.type = mapTtypes[props.record.ttype];
      ruleForm.level = props.record.tdiff;
      ruleForm.class = props.record.knowGory;
      ruleForm.score = props.record.score;
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
      } else if (ruleForm.type === "编程") {
        const chineseWordReg = /[\u4e00-\u9fa5]/g;
        ruleForm.content = props.record.tproblem.match(chineseWordReg).join("");
      }
    } else {
      //不知道为什么没法自动清除
      for (let key in mapRuleForm) {
        ruleForm[key] = mapRuleForm[key];
      }
    }
  },
);

// 定义各种form参数
const formSize = ref("default");
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
const userCode = ref("");

// 此处单选和多选都是用的多选框，需要处理一下单选只能选择一个
const buttonLoading = ref(false);
const buttonRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      buttonLoading.value = true;
      let res;
      //基础数据
      let payload = {
        ttype: reverseTtype[ruleForm.type],
        tdiff: ruleForm.level,
        knowGory: ruleForm.class,
        score: ruleForm.score,
        tproblem: ruleForm.content,
        answerInfo: ruleForm.analysis,
      };
      //判断是修改还是新建。。
      if (Object.keys(props.record).length > 0) {
        payload = {
          ...payload,
          tid: props.record.tid,
        };
      } else {
        payload = {
          ...payload,
          useNum: 0,
          createBy: userStore.username,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
      }
      if (ruleForm.type === "单选") {
        payload = {
          ...payload,
          ta: ruleForm.optionA,
          tb: ruleForm.optionB,
          tc: ruleForm.optionC,
          td: ruleForm.optionD,
          answer: ruleForm.radio,
        };
      } else if (ruleForm.type === "多选") {
        payload = {
          ...payload,
          ta: ruleForm.optionA,
          tb: ruleForm.optionB,
          tc: ruleForm.optionC,
          td: ruleForm.optionD,
          te: ruleForm.optionE,
          tf: ruleForm.optionF,
          answer: ruleForm.checkBoxList.join(""),
        };
      } else if (ruleForm.type === "判断") {
        payload = {
          ...payload,
          answer: ruleForm.isTure,
        };
      } else if (ruleForm.type === "简答") {
        payload = {
          ...payload,
          answer: ruleForm.writeContent,
        };
      } else if (ruleForm.type === "编程" && Object.keys(props.record).length === 0) {
        payload = {
          ...payload,
          tproblem: valueHtml.value,
          //反正后端也不会搞，我直接把编程题所有的字段都存在testInput上，
          //testOutput字段存执行的函数！
          testInput: JSON.stringify(examStore.codeParamsList),
          testOutput: JSON.stringify(userCode.value),
        };
      }
      res = await addQuestion(payload);
      if (res.code === 200) {
        ElMessage.success(Object.keys(props.record).length > 0 ? "修改成功！" : "新建成功！");
        emit("reLoadData", true);
        closeModal(ruleFormRef.value);
      } else {
        ElMessage.error(Object.keys(props.record).length > 0 ? "修改失败！" : "新建失败！");
      }
      buttonLoading.value = false;
    } else {
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
  });
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
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
/deep/.el-input__validateIcon {
  display: none;
}
</style>
