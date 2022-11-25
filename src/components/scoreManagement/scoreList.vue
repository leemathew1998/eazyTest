<template>
  <BasicCardVue>
    <template #title>成绩列表</template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between container-scoreList">
        <el-table :data="tableData.value" stripe style="width: 100%" :max-height="tableHeight"
          :default-sort="{ prop: 'useCount', order: 'descending' }" v-loading="loading" element-loading-text="加载中...">
          <el-table-column prop="examName" label="考试名称" min-width="200" />
          <el-table-column prop="userName" label="考生姓名" min-width="100" />
          <el-table-column prop="examTime" label="开考时间" min-width="170" />
          <el-table-column prop="markBy" label="阅卷人" min-width="100">
            <template #default="scope">
              {{ scope.row.markBy ? scope.row.markBy : "-" }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="markStatus" label="阅卷状态">
            <template #default="scope">
              {{ scope.row.markStatus === "1" ? "已阅卷" : scope.row.markStatus === "2" ? "未完成" : "未阅卷" }}
            </template>
          </el-table-column> -->
          <el-table-column prop="isTrue" label="参加考试" min-width="100">
            <template #default="scope">
              {{ scope.row.isTrue !== "1" ? "已参加" : "未参加" }}
            </template>
          </el-table-column>
          <el-table-column prop="markTime" label="阅卷时间" min-width="170">
            <template #default="scope">
              {{ scope.row.markTime ? scope.row.markTime : "-" }}
            </template>
          </el-table-column>
          <el-table-column prop="scoreSum" label="得分" min-width="100">
            <template #default="scope"> {{ solveScore(scope.row) }} </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-2 pagi flex justify-end" background :page-sizes="[10, 20, 30, 40, 50]"
          :total="params.total" @currentChange="handlerPageChange" @size-change="handleSizeChange"
          layout="sizes, prev, pager, next" />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { getList } from "@/api/scoreManagement.js";
import emiter from "@/utils/mitt.js";
import dayjs from "dayjs";
//搜索内容
emiter.on("scoreManage-search", (newVal) => {
  params.value.pageNo = 1;
  params.value.examName = newVal.examName;
  params.value.userName = newVal.userName;
  params.value.markBy = newVal.reviewer;
  params.value.isTrue = newVal.isJoin;
  params.value.beginTime = newVal.timeRange[0] ? dayjs(newVal.timeRange[0]).format("YYYY-MM-DD HH:mm:ss") : "";
  params.value.endTime = newVal.timeRange[1]
    ? dayjs.unix(dayjs(newVal.timeRange[1]).unix() + 86399).format("YYYY-MM-DD HH:mm:ss")
    : "";
  loadData();
});
const tableHeight = ref(500);
onMounted(() => {
  //动态处理table高度，如果超过有滚动条！
  tableHeight.value =
    document.getElementsByClassName("container-scoreList")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
  setTimeout(() => {
    loadData();
  }, 0);
});
onBeforeUnmount(() => {
  emiter.off("scoreManage-search");
});
//如果没有参加考试，那就不显示得分
const solveScore = (record) => {
  return record.isTrue === "1" ? "-" : record.scoreSum;
}
//获取数据
const loading = ref(false);
const tableData = reactive({ value: [] });
const params = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
const loadData = async () => {
  loading.value = true;
  const res = await getList(params.value);
  if (res.code === 200) {
    params.value.total = res.data.total;
    tableData.value = res.data.records;
  }
  loading.value = false;
};
//分页
const handlerPageChange = (pageNo) => {
  params.value.pageNo = pageNo;
  loadData();
};
const handleSizeChange = (size) => {
  params.value.pageNo = 1;
  params.value.pageSize = size;
  loadData();
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
:deep(.el-input__inner) {
  width: 100% !important;
}
</style>
