<template>
  <BasicCardVue>
    <template #title>成绩列表</template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between container">
        <el-table
          :data="tableData.value"
          stripe
          style="width: 100%"
          :max-height="tableHeight"
          :default-sort="{ prop: 'useCount', order: 'descending' }"
          v-loading="loading"
        >
          <el-table-column prop="examName" label="考试名称" min-width="140" />
          <el-table-column prop="userName" label="考生姓名" width="100" />
          <el-table-column prop="examTime" label="考试时间" min-width="170" />
          <el-table-column prop="markBy" label="阅卷人" width="100">
            <template #default="scope">
              {{ scope.row.markStatus ? scope.row.markBy : "暂无" }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="markStatus" label="阅卷状态">
            <template #default="scope">
              {{ scope.row.markStatus === "1" ? "已阅卷" : scope.row.markStatus === "2" ? "未完成" : "未阅卷" }}
            </template>
          </el-table-column> -->
          <el-table-column prop="isTrue" label="参加考试">
            <template #default="scope">
              {{ scope.row.isTrue === "1" ? "已参加" : "未参加" }}
            </template>
          </el-table-column>
          <el-table-column prop="markTime" label="阅卷时间" min-width="170">
            <template #default="scope">
              {{ scope.row.markStatus ? scope.row.markTime : "暂无" }}
            </template>
          </el-table-column>
          <el-table-column prop="scoreSum" label="得分">
            <template #default="scope"> {{ scope.row.scoreSum }}分 </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt-2 mb-2 pagi flex justify-end"
          background
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="params.total"
          @currentChange="handlerPageChange"
          @size-change="handleSizeChange"
          layout="sizes, prev, pager, next"
        />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { getList } from "@/api/scoreManagement.js";
import emiter from "@/utils/mitt.js";
//搜索内容
emiter.on("scoreManage-search", (newVal) => {
  params.value.pageNo = 1;
  params.value.examName = newVal.examName;
  params.value.userName = newVal.userName;
  params.value.markBy = newVal.reviewer;
  params.value.isTrue = newVal.isJoin;
  params.value.timeRange = newVal.timeRange;
  loadData();
});
const tableHeight = ref(500);
onMounted(() => {
  //动态处理table高度，如果超过有滚动条！
  tableHeight.value =
    document.getElementsByClassName("container")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
});
onBeforeUnmount(() => {
  emiter.off("scoreManage-search");
});
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
const changeInfo = (record) => {
  console.log(record);
};
const deleteItem = (record) => {
  console.log(record);
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
// 上传
const uploadModal = ref(false);
// 新增
const increaseModal = ref(false);
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
:deep(.el-input__inner) {
  width: 100% !important;
}
</style>
