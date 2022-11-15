<template>
  <el-dialog v-model="props.toggleExamModal" title="新增考试" width="50%" @close="closeModal(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" size="default" status-icon>
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
            <el-select
              v-model="ruleForm.examCrews"
              placeholder="请选择考试人员"
              multiple
              collapse-tags
              @change="changeExamCrews"
            >
              <el-option-group v-for="group in options.value" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" justify="center" class="mb-4">
        <el-col :span="14" :offset="0">
          <el-form-item label="考试时长" prop="examTime">
            <el-input v-model="ruleForm.examTime" placeholder="请输入考试时长">
              <template #append>分钟</template>
            </el-input>
          </el-form-item></el-col
        >
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
import { nextTick, reactive, ref } from "vue";
import { rules } from "./constants.js";
import { addOneExam } from "@/api/invigilateManagement.js";
import { changePaperUseCount } from "@/api/examBankManagement.js";
import { getList } from "@/api/userManagement.js";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
import dayjs from "dayjs";
import lodash from "lodash";
const userStore = useUserStore();
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
//加载用户列表,此处使用用户列表，最后需要修改
const options = reactive({
  value: [
    {
      label: "组别选择",
      options: [],
    },
    {
      label: "人员选择",
      options: [],
    },
  ],
});
const changeExamCrews = (val) => {
  // 对数据进行筛选，如果选择组别，那就需要全选中所有的符合条件的
  let result = [];
  val.forEach((item, index) => {
    if (String(Number(item)) === "NaN") {
      if (lastCheckList.includes(item)) {
        //上次和这次都存在！检查还有没有，如果有就不用操作了，没有的话就需要删掉item!
        if (!val.find((id) => saveMap[item].includes(id))) {
          result = val.filter((i) => i != item);
        }
      } else {
        //上次没有，那就添加进去
        result = [...new Set([...val, ...saveMap[item]])];
      }
    } else {
      result = val;
    }
  });
  //循环上次的，如果上次有组别的，这次没有，那就需要把其中的删除掉
  lastCheckList.forEach((item) => {
    if (String(Number(item)) === "NaN") {
      console.log(val.find((innerId) => innerId === item));
      if (!val.find((innerId) => innerId === item)) {
        //需要取消！
        result = [];
        val.forEach((id) => {
          if (!saveMap[item].includes(id)) {
            result.push(id);
          }
        });
      }
    }
  });
  //如果某一次已经全部选中了某个组别的全部内容，那就需要把组别也给填充进去！
  Object.keys(saveMap).forEach((item) => {
    if (saveMap[item].length === result.length) {
      //有可能,继续看看
      let flag = true;
      saveMap[item].forEach((innerId) => {
        if (!result.includes(innerId)) {
          flag = false;
        }
      });
      if (flag) {
        result.push(item);
      }
    }
  });
  lastCheckList = result;
  ruleForm.examCrews = result;
};
let lastCheckList = [];
const saveMap = {};
const loadUserList = async () => {
  // alert("此处使用用户列表，最后需要修改");
  const res = await getList({
    pageNo: 1,
    pageSize: 1000000,
  });
  if (res.code === 200) {
    res.data.records.forEach((item) => {
      if (!options.value[0].options.map((i) => i.label).includes(item.theGroup)) {
        //没包含在里面，需要第一次添加到组别选择上
        saveMap[item.theGroup] = [];
        options.value[0].options.push({
          label: item.theGroup,
          value: item.theGroup,
        });
      }
      saveMap[item.theGroup].push(item.userId);
      options.value[1].options.push({
        label: item.username,
        value: item.userId,
      });
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
      const temp_Crews = lodash.cloneDeep(ruleForm.examCrews);
      const payload = {
        examName: ruleForm.examName,
        examPaperId: props.record.examPaperId,
        examPaperName: props.record.examPaperName,
        theAuthor: userStore.username,
        pSum: props.record.sum,
        markStatus: 1,
        userIds: temp_Crews.filter((item) => String(Number(item)) !== "NaN").join(","),
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
loadUserList();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
/deep/.el-input--default {
  width: 100% !important;
}
/deep/.el-select--default {
  width: 100% !important;
}
/deep/.el-range__icon {
  display: none;
}
</style>
