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
      <el-upload v-model:file-list="fileList" :auto-upload="false" ref="uploadRef" :limit="1" :show-file-list="false"
        action="fakeaction" accept=".xls">
        <el-button type="primary" :loading="loading">导入excel</el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { solveFile } from './methods.js'
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
};
//监控文件列表，当文件列表发生变化时，开始上传
const loading = ref(false)
watch(() => fileList.value, async (newVal) => {
  if (newVal.length > 0) {
    loading.value = true
    await solveFile(newVal[0].raw);
    closeModal();
    emit("reLoadData", true)
    fileList.value = []
    loading.value = false
    // uploadFile()
  }
})
</script>
<style lang="less" scoped>
.downloadTemplate {
  font-size: 12px;
  color: #2440b3;
  margin-left: 0.5rem;
}
</style>
