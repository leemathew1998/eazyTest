<template>
  <el-dialog v-model="uploadModal" title="批量导入试题" width="40%" @closed="closeModal" :destroy-on-close="true">
    <!-- <el-progress v-if="percentage != 0" :percentage="percentage" :status="progressStatus" /> -->
    <div class="flex flex-col items-center">
      <img src="@/assets/image/u1524.svg" alt="" />
      <template class="flex m-4">
        <h1 style="font-size: 20px">Excel批量导入试题</h1>
      </template>
      <h3 style="font-size: 14px" class="wh whitespace-nowrap mb-4">
        Excel批量导入试题功能支持：单选题，多选题，判断题，简答题，<span style="text-decoration:line-through">编程题</span>
        <a class="downloadTemplate" href="/static/试题导入模板.xls">下载示例文件</a>
      </h3>
      <div v-html="contentInfo"></div>
      <el-upload v-model:file-list="fileList" :auto-upload="false" ref="uploadRef" :limit="1" :show-file-list="false"
        action="fakeaction" accept=".xls">
        <el-button type="primary" v-if="!fileList.length">{{ buttonContent }}</el-button>
      </el-upload>
      <el-button type="primary" v-if="fileList.length" :loading="loading" @click="batchUploadRecord">{{ buttonContent
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { solveFile } from './methods.js'
import { addQuestion } from "@/api/questionBankManagement.js";
//状态参数
const fileList = ref([
])
const emit = defineEmits();
const uploadRef = ref();
const props = defineProps({
  uploadModal: Boolean,
});
const closeModal = () => {
  emit("update:uploadModal", false);
  setTimeout(() => {
    contentInfo.value = ""
    buttonContent.value = "导入excel"
    temp_batchData = []
    fileList.value = []
  }, 300);
};
//监控文件列表，当文件列表发生变化时，开始上传
const loading = ref(false)
const buttonContent = ref("导入excel")
const contentInfo = ref("")
let temp_batchData = []
watch(() => fileList.value, async (newVal) => {
  if (newVal.length > 0) {
    const { batchData, alertInfoStr } = await solveFile(newVal[0].raw);
    if (alertInfoStr.length > 0 && batchData.length > 0) {
      buttonContent.value = "仍要导入"
    } else if (alertInfoStr.length > 0 && batchData.length == 0) {
      buttonContent.value = "请重新选择excel"
    } else if (alertInfoStr.length == 0 && batchData.length > 0) {
      buttonContent.value = "开始导入"
    } else {
      buttonContent.value = "导入excel"
    }
    temp_batchData = batchData
    contentInfo.value = alertInfoStr
  }
})
const batchUploadRecord = async () => {
  if (fileList.value.length > 0) {
    loading.value = true
    const batchData = temp_batchData.map((item) => addQuestion(item))
    //如果有数据，就进行批量导入
    if (temp_batchData.length) {
      contentInfo.value = ""
      temp_batchData = []
      fileList.value = []
      const res = await Promise.allSettled(batchData);
      res.find((item) => item.status === "rejected")
        ? ElMessage.error("部分试题导入失败！")
        : ElMessage.success("导入成功");
      closeModal();
      emit("reLoadData", true)
    }

    loading.value = false

  }
}
</script>
<style lang="less" scoped>
.downloadTemplate {
  font-size: 12px;
  color: #2440b3;
  margin-left: 0.5rem;
}
</style>
