<template>
  <div class="flex" v-loading="loading" element-loading-text="加载中...">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" label-position="left"
      class="demo-ruleForm" size="default" v-if="props.fatherUtils.status !== 2">
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12" :offset="0">
          <el-form-item label="试卷名称" prop="examName">
            <el-input v-model="ruleForm.examName" placeholder="请输入试卷名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <!-- <el-form-item label="总分" prop="totalScore">
            <el-input placeholder="请输入总分" type="number" v-model="ruleForm.totalScore"> </el-input>
          </el-form-item> -->
          <el-form-item label="难度系数" prop="level">
            <el-slider v-model="ruleForm.level" :format-tooltip="formatTooltip" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-4 loopTypes">
        <el-col :span="12" :offset="0">
          <el-form-item label="题型" prop="quesTypes">
            <el-select multiple collapse-tags placeholder="请选择题型" v-model="ruleForm.quesTypes">
              <el-option label="单选题" value="1" />
              <el-option label="多选题" value="2" />
              <el-option label="简答题" value="3" />
              <el-option label="判断题" value="4" />
              <el-option label="编程题" value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="知识分类" prop="class">
            <el-select placeholder="请选择分类" v-model="ruleForm.class">
              <el-option label="前端" value="1" />
              <el-option label="后端" value="2" />
              <el-option label="设计" value="3" />
              <el-option label="测试" value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 开始遍历选择的题量 -->
      <el-row :gutter="20" class="flex flex-wrap overflow-hidden" :style="{ width: loopWidth }">
        <div :key="index" v-for="(item, index) in ruleForm.quesTypes" class="mb-4">
          <el-col :span="12" :offset="0">
            <el-form-item :label="`${mapTtypes[item]}题量`" :prop="`count${item}`">
              <el-input placeholder="请输入题量" type="number" v-model="ruleForm[`count${item}`]"> </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
import { ref, watch, reactive, onMounted } from "vue";
import { useExamStore, useUserStore } from "@/store";
import { rules } from "./methods.js";
import { mapTtypes } from "@/components/questionBankManagement/constants.js";
import { addExamAuto } from "@/api/examBankManagement.js";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
// 初始化store，我们把考生答案放在pinia中！
const userStore = useUserStore();
const props = defineProps({
  autoRenderForm: Object,
  fatherUtils: Object,
});
const loading = ref(false);
//此页面中最重要的部分，如果点击了生成试卷，那footerTitle会变长确定，此时需要进行提交，如果成功
//那就变成确定
watch(
  () => props.fatherUtils.status,
  async (newVal, oldVal) => {
    if (newVal === 1) {
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          loading.value = true;
          const payload = {
            examPaperName: ruleForm.examName,
            createBy: userStore.username,
            createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            knowGory: ruleForm.class,
            singleTnum: ruleForm.count1 ? Number(ruleForm.count1) : 0,
            moreTnum: ruleForm.count2 ? Number(ruleForm.count1) : 0,
            judgeTnum: ruleForm.count3 ? Number(ruleForm.count1) : 0,
            ansTnum: ruleForm.count4 ? Number(ruleForm.count1) : 0,
            programTnum: ruleForm.count5 ? Number(ruleForm.count1) : 0,
            // sum: ruleForm.totalScore,不需要传总分，后端生成。
            diff: ruleForm.level,
          };
          //处理5种题目类型，后端需要这么接收
          [1, 2, 3, 4, 5].forEach((item) => {
            if (ruleForm.quesTypes.includes(String(item))) {
              payload[`type${item}`] = String(item);
            } else {
              payload[`type${item}`] = "";
            }
          });
          const res = await addExamAuto(payload);
          if (res.code === 200) {
            props.fatherUtils.status = 2;
            ElMessage.success("生成成功！");
          } else {
            props.fatherUtils.status = 0;
            ElMessage.error("生成失败！");
          }
          loading.value = false;
        } else if (newVal !== oldVal && newVal === 1) {
          props.fatherUtils.status = 0;
        }
      });
    }
  },
);
let loopWidth = ref("100%");
onMounted(() => {
  //处理循环部分的宽度，不知道为啥会撑开，在此处变成固定的！
  const width = document.getElementsByClassName("loopTypes")[0].offsetWidth;
  loopWidth.value = `${width + 1}px !important`;
});
// 页面相关
const ruleFormRef = ref();
const ruleForm = reactive({
  examName: "",
  level: 0,
  totalScore: "",
  quesTypes: [],
  class: "",
  //五种题量
  count1: "",
  count2: "",
  count3: "",
  count4: "",
  count5: "",
});

const formatTooltip = (val) => {
  return val / 100;
};
</script>

<style lang="less" scoped>
// @import url("@/assets/css/common.less");
/deep/.el-input-group {
  width: 14rem;
}

/deep/.el-select {
  width: 15.375rem;
}

:deep(.el-form-item__error) {
  white-space: nowrap;
}

/deep/.el-input {
  width: 15.375rem;
}

/deep/.el-slider {
  width: 15.375rem;
}

.left {
  flex: 1;
}
</style>
