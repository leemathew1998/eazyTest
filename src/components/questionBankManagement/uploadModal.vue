<template>
  <el-dialog v-model="uploadModal" title="批量导入试题" width="40%" @closed="closeModal" :destroy-on-close="true">
    <el-progress v-if="percentage != 0" :percentage="percentage" :status="progressStatus" />
    <div class="flex flex-col items-center">
      <img src="@/assets/image/u1524.svg" alt="" />
      <template class="flex m-4">
        <h1 style="font-size: 20px">Excel批量导入试题</h1>
      </template>
      <h3 style="font-size: 14px" class="wh whitespace-nowrap mb-4">
        Excel批量导入试题功能支持：单选题，多选题，判断题，简答题，<span style="text-decoration:line-through">编程题</span>
        <a class="downloadTemplate" href="javascript:;" @click="downloadTemplate">下载示例文件</a>
      </h3>
      <el-upload v-model:file-list="fileList" :auto-upload="false" ref="uploadRef" :limit="1" :show-file-list="false"
        action="fakeaction" accept=".xlsx,.xls">
        <el-button type="primary">导入excel</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { ref, computed, watch, onUnmounted } from "vue";
import { getTemplateFile, uploadFileAPI } from '@/api/questionBankManagement.js'
//状态参数
let timer;
let startTime;
const fileList = ref([
])
const emit = defineEmits();
const uploadRef = ref()
const props = defineProps({
  uploadModal: Boolean,
});
onUnmounted(() => {
  cancelAnimationFrame(timer);
  timer = null;
});
const closeModal = () => {
  cancelAnimationFrame(timer);
  percentage.value = 0;
  finished.value = false;
  emit("update:uploadModal", false);
};

const percentage = ref(0);
const finished = ref(false);
//进度条状态
const progressStatus = computed(() => {
  if (percentage.value === 100 && finished.value) {
    return "success";
  } else if (percentage.value === 100 && !finished.value) {
    return "exception";
  } else {
    return "";
  }
});
//监控文件列表，当文件列表发生变化时，开始上传
watch(() => fileList.value, (newVal) => {
  if (newVal.length > 0) {
    uploadFile()
  }
})
const uploadFile = async () => {
  startTime = new Date().valueOf();
  timer = requestAnimationFrame(increasePercentage);
  var form = new FormData();
  form.append("file", fileList.value[0].raw);
  // //   开始提交操作，成功后改变finished
  const res = await uploadFileAPI(form)
  if (res.code === 200) {
    finished.value = true;
  } else {
    ElMessage.error(res.message)
    closeModal()
    finished.value = false
  }
  console.log(fileList, res)

};

//requestAnimationFrame处理进度条
const increasePercentage = () => {
  let endTime = new Date().valueOf();
  percentage.value = Math.floor((endTime - startTime) / 66);
  if (percentage.value === 100 && finished.value) {
    ElMessage.success("上传成功！");
    closeModal();
    return;
  } else if (percentage.value === 100 && !finished.value) {
    closeModal();
    ElMessage.error("上传失败！请刷新后重试");
    return
  }
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
