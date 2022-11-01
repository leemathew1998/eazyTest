<template>
  <el-dialog v-model="props.toggleModal" title="第三届前端技术大赛" width="50%">
    <div style="height: 40vh">
      <div class="flex items-center justify-between">
        <span class="top-item green">应考人数：50人</span>
        <span class="top-item red">实考人数：47人</span>
        <span class="top-item blue">平均分：89.23分</span>
      </div>
      <div class="h-full -mb-8 flex flex-col justify-between">
        <el-table :data="tableData" stripe :default-sort="{ prop: 'rank', order: 'descending' }">
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="username" label="考生名称" />
          <el-table-column prop="level" label="试卷难度" />
          <el-table-column prop="score" sortable label="考试分数" min-width="110">
            <template #default="scope">
              {{ `${scope.row.score}分` }}
            </template>
          </el-table-column>
          <el-table-column prop="rank" sortable label="排名" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="time" label="时间" min-width="180" />
        </el-table>
        <el-pagination class="mt-2 mb-4" background layout="prev, pager, next" :total="1000" />
      </div>
    </div>

    <template #footer>
      <span class="flex justify-end pt-10">
        <el-button type="primary" @click="handlerClose"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
// 状态模块
const props = defineProps({
  toggleModal: Boolean,
});
const emits = defineEmits();
const handlerClose = () => {
  emits("update:toggleModal", false);
};
//table内容
const tableData = reactive([]);
for (let index = 0; index < 20; index++) {
  tableData.push({
    index: index + 1,
    username: Math.random() > 0.5 ? "前端技术考试一" : "前端技术考试二",
    level: Math.random() > 0.5 ? "中等" : "困难",
    score: Math.floor(Math.random() * 90),
    rank: index + 1,
    type: "普通考试",
    time: "2022-10-31 12:21:12",
  });
}
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
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
