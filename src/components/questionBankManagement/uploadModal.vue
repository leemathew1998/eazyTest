<template>
  <el-dialog v-model="uploadModal" title="批量导入试题" width="40%" @closed="closeModal" :destroy-on-close="true">
    <el-progress v-if="finished" :percentage="percentage" :status="progressStatus" />
    <div class="flex flex-col items-center">
      <img src="@/assets/image/u1524.svg" alt="" />
      <template class="flex m-4">
        <h1 style="font-size: 20px">Excel批量导入试题</h1>
      </template>
      <h3 style="font-size: 14px" class="wh whitespace-nowrap mb-4">
        Excel批量导入试题功能支持：单选题，多选题，判断题，简答题，<span style="text-decoration:line-through">编程题</span>
        <a class="downloadTemplate" href="javascript:;" @click="downloadTemplate">下载示例文件</a>
      </h3>
      <el-button @click="uploadFile">导入excel</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { ref, computed } from "vue";
import { getTemplateFile } from '@/api/questionBankManagement.js'
let timer;
let startTime;
const props = defineProps({
  uploadModal: Boolean,
});
const emit = defineEmits();
const percentage = ref(0);
const finished = ref(false);
const progressStatus = computed(() => {
  if (percentage.value === 100 && finished.value) {
    return "success";
  } else if (percentage.value === 100 && !finished.value) {
    return "exception";
  } else {
    return "";
  }
});
const closeModal = () => {
  cancelAnimationFrame(timer);
  percentage.value = 0;
  finished.value = false;
  emit("update:uploadModal", false);
};
const increasePercentage = () => {
  let endTime = new Date().valueOf();
  percentage.value = Math.floor((endTime - startTime) / 100);
  if (percentage.value === 100) {
    ElMessage.success("上传成功！");
    closeModal();
    return;
  }
  timer = requestAnimationFrame(increasePercentage);
};
const uploadFile = () => {
  startTime = new Date().valueOf();
  //   开始提交操作，成功后改变finished
  finished.value = true;
  timer = requestAnimationFrame(increasePercentage);
};
//下载模版文件
const downloadTemplate = async () => {
  const res = await getTemplateFile()
  const link = document.createElement("a");
  link.style.dispaly = "none";
  let binaryData = [];
  binaryData.push(res);
  link.href = window.URL.createObjectURL(new Blob(binaryData));
  link.setAttribute("download", "题库模版文件.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
<style lang="less" scoped>
.downloadTemplate {
  font-size: 12px;
  color: #2440b3;
  margin-left: 0.5rem;
}
</style>
