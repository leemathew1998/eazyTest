<template>
  <el-dialog v-model="props.toggleExamModal" title="修改考试信息" width="40%" @close="closeModal(ruleFormRef)">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="pr-24"
      size="default"
      status-icon
      v-loading="loading"
      element-loading-text="加载中..."
    >
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="ruleForm.examName" placeholder="请输入考试名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试类型" prop="examType">
            <el-select v-model="ruleForm.examType" placeholder="请输入考试类型">
              <el-option label="普通在线考试" value="1" />
              <el-option label="集中在线考试" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="及格分数" prop="examPassScore">
            <el-input v-model.number="ruleForm.examPassScore" type="text" placeholder="请输入及格分数" /> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试人员" prop="examCrews">
            <el-cascader
              v-model="ruleForm.examCrews"
              :options="options.value"
              :props="{ multiple: true }"
              placeholder="请选择考试人员"
              ref="cascaderRef"
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试时长" prop="examTime">
            <el-input v-model.number="ruleForm.examTime" placeholder="请输入考试时长" class="hasAppend">
            </el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20" justify="center">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试时间" prop="examTimeRange">
            <el-date-picker
              v-model="ruleForm.examTimeRange"
              type="datetimerange"
              format="MM/DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :clearable="false"
              style="width: 16rem !important"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="buttonLoading"
          ref="buttonRef"
          class="animated"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { nextTick, reactive, ref, watch } from "vue";
import { rules } from "@/components/examBankManagement/constants.js";
import { updateOneExam } from "@/api/invigilateManagement.js";
import { changePaperUseCount } from "@/api/examBankManagement.js";
import { getList } from "@/api/userManagement.js";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
import dayjs from "dayjs";
// 状态参数
const props = defineProps({
  toggleExamModal: Boolean,
  record: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  if (!formEl) return;
  nextTick(() => {
    formEl.resetFields();
  });
  emit("update:toggleExamModal", false);
};
watch(
  () => props.toggleExamModal,
  async (newVal) => {
    if (newVal) {
      await loadUserList();
      nextTick(() => {
        ruleForm.examName = props.record.examName;
        ruleForm.examType = props.record.examType;
        ruleForm.examTime = Number(props.record.examLongTime);
        ruleForm.examTimeRange = [props.record.examBeginTime, props.record.examEndTime];
        ruleForm.examPassScore = Number(props.record.passScore);
        //需要额外看一下examCrews
        ruleForm.examCrews.push(...props.record.userIds.split(","));
        loading.value = false;
      });
    }
  },
);
//加载用户列表,此处使用用户列表，最后需要修改
const options = reactive({
  value: [],
});
const cascaderRef = ref();
const loading = ref(false);
const theGroupList = [];
const loadUserList = async () => {
  loading.value = true;
  // alert("此处使用用户列表，最后需要修改");
  const res = await getList({
    pageNo: 1,
    pageSize: 1000000,
  });
  if (res.code === 200) {
    res.data.records.forEach((item) => {
      if (!theGroupList.includes(item.theGroup)) {
        theGroupList.push(item.theGroup);
        options.value.push({
          value: item.theGroup,
          label: item.theGroup,
          children: [],
        });
      }
      //开始寻找所在的children
      const theChildren = options.value.find((option) => option.label === item.theGroup);
      if (theChildren) {
        theChildren.children.push({ value: item.userId, label: item.username });
      }
    });
  }
};
//页面信息
const ruleFormRef = ref();
const ruleForm = reactive({
  examName: "",
  examType: "",
  examTime: "",
  examTimeRange: [],
  examPassScore: "",
  examCrews: [],
});
const buttonLoading = ref(false);
const buttonRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      buttonLoading.value = true;
      let userIds = [];
      //ids会不太一样，需要处理一下
      ruleForm.examCrews.forEach((item) => {
        if (Array.isArray(item)) {
          userIds.push(item[1]);
        } else {
          userIds.push(item);
        }
      });
      const payload = {
        examName: ruleForm.examName,
        examId: props.record.examId,
        userIds: userIds.join(","),
        examType: ruleForm.examType,
        examBeginTime: dayjs(ruleForm.examTimeRange[0]).format("YYYY-MM-DD HH:mm:ss"),
        examEndTime: dayjs(ruleForm.examTimeRange[1]).format("YYYY-MM-DD HH:mm:ss"),
        examLongTime: ruleForm.examTime,
        passScore: ruleForm.examPassScore,
      };
      const res = await updateOneExam(payload);
      if (res.code === 200) {
        await changePaperUseCount({ examPaperId: props.record.examPaperId }); //增加试卷使用次数
        closeModal(ruleFormRef.value);
        emit("reloadData", true);
        ElMessage.success("修改成功！");
      } else {
        ElMessage.error("修改失败！");
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
/deep/.el-form-item__content {
  width: 16rem !important;
}
/deep/.el-input__wrapper {
  width: 16rem !important;
}
/deep/.el-input__inner {
  width: 16rem !important;
}
/deep/.el-input--default {
  width: 16rem !important;
}
/deep/.el-textarea__inner {
  width: 16rem !important;
}
/deep/.el-date-editor {
  width: 16rem !important;
}
/deep/.asterisk-left {
  width: 21rem !important;
}
/deep/.el-table__cell {
  .cell {
    white-space: nowrap;
  }
}
</style>
