<template>
  <el-dialog v-model="toggleExamModal" title="新增考试" width="43%" @close="closeModal(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" size="default" status-icon v-loading="loading"
      element-loading-text="加载中...">
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="考试名称" prop="examName">
            <el-input v-model="ruleForm.examName" placeholder="请输入考试名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="考试类型" prop="examType">
            <el-select v-model="ruleForm.examType" placeholder="请输入考试类型">
              <el-option label="普通在线考试" value="1" />
              <el-option label="集中在线考试" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="9" :offset="0">
          <el-form-item label="及格分数" prop="examPassScore">
            <el-input v-model.number="ruleForm.examPassScore" placeholder="输入及格分数" class="hasAppend" />
          </el-form-item>
        </el-col>
        <el-col :span="15" :offset="0">
          <el-form-item label="考试人员" prop="examCrews">
            <el-cascader v-model="ruleForm.examCrews" :options="options.value" :props="{ multiple: true }"
              placeholder="请选择考试人员" ref="cascaderRef" collapse-tags collapse-tags-tooltip clearable
              class="cascader-examCrews" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="9" :offset="0">
          <el-form-item label="考试时长" prop="examTime">
            <el-input v-model.number="ruleForm.examTime" placeholder="输入考试时长" class="hasAppend">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="15" :offset="0">
          <el-form-item label="考试时间" prop="examTimeRange">
            <el-date-picker v-model="ruleForm.examTimeRange" type="datetimerange" format="MM/DD HH:mm:ss"
              range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :clearable="false"
              :default-time="defaultTime" :disabled-date="disabledDate" style="width: 16rem !important" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="buttonLoading" ref="buttonRef"
          class="animated">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import { rules } from "./constants.js";
import { addOneExam } from "@/api/invigilateManagement.js";
import { changePaperUseCount } from "@/api/examBankManagement.js";
import { getList } from "@/api/userManagement.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import lodash from "lodash";
const userStore = useUserStore();
const router = useRouter();
// 状态参数
const props = defineProps({
  toggleExamModal: Boolean,
  record: Object,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  if (!formEl) return;
  setTimeout(() => {
    formEl.resetFields();
    emit("update:toggleExamModal", false);
  }, 300);
};
const ruleForm = reactive({
  examName: "",
  examType: "",
  examTime: null,
  examTimeRange: [],
  examPassScore: "",
  examCrews: [],
});
watch(
  () => props.toggleExamModal,
  (newVal) => {
    newVal && loadUserList();
  },
);
//开始结束时间时分秒
const defaultTime = ref([
  new Date(),
  new Date(2000, 2, 1, 23, 59, 59),
])
//当前时间之前的日期不可选
const disabledDate = (date) => {
  return date.getTime() < Date.now() - 8.64e7;
}
//还需要判断一下如果是集中考试的话，时长应该和开始结束时间差是对应的，普通考试就不需要了
watch(() => ruleForm.examTimeRange, (newVal) => {
  if (newVal.length > 0 && ruleForm.examType == 2 && ruleForm.examTime && ruleForm.examTime != dayjs(newVal[1]).diff(dayjs(newVal[0]), 'minute')) {
    ElMessageBox.alert('集中考试时长应该和开始结束时间差是对应的', '提示', {
      confirmButtonText: '确定',
      callback: action => {
        ruleForm.examTimeRange = [];
      }
    });
  }
})
watch(() => ruleForm.examType, (newVal) => {
  if (newVal == 2 && ruleForm.examTime && ruleForm.examTimeRange.length > 0 && ruleForm.examTime != dayjs(ruleForm.examTimeRange[1]).diff(dayjs(ruleForm.examTimeRange[0]), 'minute')) {
    ElMessageBox.alert('集中考试时长应该和开始结束时间差是对应的', '提示', {
      confirmButtonText: '确定',
      callback: action => {
        ruleForm.examType = '';
      }
    });
  }
})


//加载用户列表,此处使用用户列表，最后需要修改
const options = reactive({
  value: [],
});
const cascaderRef = ref();
const loading = ref(false);
const loadUserList = async () => {
  loading.value = true;
  options.value = [];
  // alert("此处使用用户列表，最后需要修改");
  const res = await getList({
    pageNo: 1,
    pageSize: 1000000,
  });
  if (res.code === 200) {
    const theGroupList = [];
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
  loading.value = false;
};
//页面信息
const ruleFormRef = ref();
const buttonLoading = ref(false);
const buttonRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      //再确定一下如果是集中考试的话，时长应该和开始结束时间差是对应的，普通考试就不需要了
      if (ruleForm.examType == 2 && ruleForm.examTime != dayjs(ruleForm.examTimeRange[1]).diff(dayjs(ruleForm.examTimeRange[0]), 'minute')) {
        ElMessageBox.alert('集中考试时长应该和开始结束时间差是对应的', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            ruleForm.examTime = '';
          }
        });
        return;
      }
      buttonLoading.value = true;
      const temp_Crews = lodash.cloneDeep(ruleForm.examCrews);
      const payload = {
        examName: ruleForm.examName,
        examPaperId: props.record.examPaperId,
        examPaperName: props.record.examPaperName,
        theAuthor: userStore.username,
        paperSums: props.record.sum,
        // markStatus: 3,
        examId: null,
        userIds: temp_Crews.map((item) => item[1]).join(","),
        examType: ruleForm.examType,
        examStatus: 1,
        examBeginTime: dayjs(ruleForm.examTimeRange[0]).format("YYYY-MM-DD HH:mm:ss"),
        examEndTime: dayjs(ruleForm.examTimeRange[1]).format("YYYY-MM-DD HH:mm:ss"),
        examLongTime: ruleForm.examTime,
        passScore: ruleForm.examPassScore,
      };
      const res = await addOneExam(payload);
      if (res.code === 200) {
        await changePaperUseCount({ examPaperId: props.record.examPaperId }); //增加试卷使用次数
        closeModal(ruleFormRef.value);
        ElMessage.success("新增成功！");
        router.push("/invigilateManagement");
      } else {
        ElMessage.error("新增失败！");
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
  width: 12rem !important;
}

/deep/.el-input__wrapper {
  width: 12rem !important;
}

/deep/.el-input__inner {
  width: 12rem !important;
}

/deep/.el-input--default {
  width: 12rem !important;
}

/deep/.el-textarea__inner {
  width: 12rem !important;
}

/deep/.el-date-editor {
  width: 12rem !important;
}

.hasAppend {
  width: 100% !important;
}

:deep(.cascader-examCrews) {
  width: 100% !important;

  .el-input {
    width: 100% !important;
  }
}

/deep/.el-table__cell {
  .cell {
    white-space: nowrap;
  }
}

:deep(.el-tag) {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
