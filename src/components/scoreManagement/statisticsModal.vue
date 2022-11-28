<template>
  <div>
    <el-dialog v-model="toggleModal" :title="props.record?.examName || ''" width="43%" @close="handlerClose">
      <div style="min-height: 40vh;" class="flex flex-col">
        <div class="flex items-center justify-between">
          <span class="top-item green">应考人数：{{ record.sunNum }}人</span>
          <span class="top-item red">实考人数：{{ record.perNum }}人</span>
          <span class="top-item blue">平均分：{{ record.examAvg }}分</span>
        </div>
        <div class="h-full statistics-container" style="flex:1">
          <el-table :data="tableData.value" :max-height="tableHeight" stripe
            :default-sort="{ prop: 'rank', order: 'descending' }" v-loading="loading">
            <el-table-column prop="userName" label="考生名称" />
            <el-table-column prop="scoreSum" sortable label="考试分数" width="110" align="center">
              <template #default="scope">
                {{ `${scope.row.scoreSum}分` }}
              </template>
            </el-table-column>
            <el-table-column prop="rank" sortable label="排名">
              <template #default="scope">
                {{ `第${scope.row.rank}名` }}
              </template>
            </el-table-column>
            <el-table-column prop="examType" label="类型">
              <template #default="scope">
                {{ scope.row.examType == 1 ? '普通考试' : '集中考试' }}
              </template>
            </el-table-column>
            <el-table-column prop="examTime" label="开考时间" min-width="170" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="flex justify-end">
          <el-button type="primary" @click="handlerClose"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getExamScoreListDetail } from "@/api/scoreManagement.js";
// 状态模块
const props = defineProps({
  toggleModal: Boolean,
  record: Object,
});
const emits = defineEmits();
const handlerClose = () => {
  emits("update:toggleModal", false);
};
const tableHeight = ref(300);
watch(() => props.toggleModal, (val) => {
  if (val) {
    setTimeout(() => {
      tableHeight.value =
        document.getElementsByClassName("statistics-container")[0]?.offsetHeight - 1;
      loadData()
    }, 0)
  }
})
// 数据模块
const payload = {
  pageNo: "1",
  pageSize: "10000000",
}
const tableData = reactive({ value: [] });
const loading = ref(false)
const loadData = async () => {
  loading.value = true
  payload.examId = props.record.examId
  const res = await getExamScoreListDetail(payload);
  if (res.code === 200 && res.success) {
    tableData.value = res.data.records
  }
  loading.value = false
};
</script>
<style lang="less" scoped>
.top-item {
  white-space: nowrap;
  padding: 1.5rem 2rem;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #ffffff;
  border-radius: 8px;
}

.green {
  background-color: #45d6b6;
}

.red {
  background-color: #e86969;
}

.blue {
  background-color: #0091ff;
}
</style>
