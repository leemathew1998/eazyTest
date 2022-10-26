<template>
  <el-dialog
    v-model="props.uploadModal"
    title="批量导入试题"
    width="50%"
    @closed="closeModal"
    :destroy-on-close="true"
  >
    <el-progress :percentage="percentage" :status="progressStatus" />
    <div class="flex flex-col items-center">
      <img src="@/assets/image/u1524.svg" alt="" />
      <template class="flex m-4">
        <h1 style="font-size: 20px">Excel批量导入试题</h1>
      </template>
      <h3 style="font-size: 14px" class="wh whitespace-nowrap mb-4">
        Excel批量导入试题功能支持：单选题，多选题，判断题，简答题，编程题
        <a class="downloadTemplate" href="/src/assets/utils/试题导入模板.xls"
          >下载示例文件</a
        >
      </h3>
      <el-button @click="uploadFile">导入excel</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, computed } from "vue";
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
  emit("update:uploadModal", false);
};
const increasePercentage = () => {
  let endTime = new Date().valueOf();
  percentage.value = Math.floor((endTime - startTime) / 100);
  if (percentage.value === 100) {
    cancelAnimationFrame(timer);
    return;
  }
  requestAnimationFrame(increasePercentage);
};
const uploadFile = () => {
  startTime = new Date().valueOf();
  //   开始提交操作，成功后改变finished
  setTimeout(() => {
    finished.value = true;
  }, 1000);
  timer = requestAnimationFrame(increasePercentage);
};
</script>
<style lang="less" scoped>
.downloadTemplate {
  font-size: 12px;
  color: #2440b3;
}
</style>
