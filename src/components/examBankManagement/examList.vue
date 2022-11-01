<template>
  <BasicCardVue>
    <template #title>试卷列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="showExamModal = true">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增试卷
        </el-button>
        <PrintExam v-model:showExamModal="showExamModal"></PrintExam>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-8">
        <el-table
          :data="tableData"
          stripe
          style="height: 60%; width: 100%"
          :default-sort="{ prop: 'useCount', order: 'descending' }"
        >
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="examName" label="试卷名称" />
          <el-table-column prop="level" label="试卷难度" />
          <el-table-column prop="historyScore" sortable label="历次考试平均分" min-width="110">
            <template #default="scope">
              {{ `${scope.row.historyScore}分` }}
            </template>
          </el-table-column>
          <el-table-column prop="useCount" sortable label="使用次数">
            <template #default="scope">
              {{ `${scope.row.useCount}次` }}
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" />
          <el-table-column prop="createdTime" label="创建时间" min-width="180" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="160">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="newExam(scope.row)">新建考试</a>
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="previewExam(scope.row)">预览</a>
              <el-divider direction="vertical" />
              <a style="color: red" href="javascript:;" @click="deleteItem(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-2" background layout="prev, pager, next" :total="1000" />
      </div>
    </template>
  </BasicCardVue>
  <PreviewPaperVue v-model:togglePreviewPaper="togglePreviewPaper"></PreviewPaperVue>
  <NewExamModal v-model:toggleExamModal="toggleExamModal"></NewExamModal>
</template>
<script setup>
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import PrintExam from "./PrintExam.vue";
import PreviewPaperVue from "./previewPaper.vue";
import { useExamStore } from "@/store";
import { loopToFillState } from "@/utils/methods.js";
import NewExamModal from "./newExamModal.vue";
const examStore = useExamStore();
const tableData = reactive([]);
const showExamModal = ref(false);
for (let index = 0; index < 20; index++) {
  tableData.push({
    index: index + 1,
    examName: Math.random() > 0.5 ? "前端技术考试一" : "前端技术考试二",
    level: Math.random() > 0.5 ? "中等" : "困难",
    historyScore: Math.floor(Math.random() * 90),
    useCount: Math.floor(Math.random() * 20),
    createdBy: "张三",
    createdTime: "2022-10-31 12:21:12",
  });
}

// 新增考试
const toggleExamModal = ref(false);
const newExam = (record) => {
  toggleExamModal.value = true;
  console.log(record);
};
// 预览试卷
const togglePreviewPaper = ref(false);
const previewExam = (record) => {
  // 假设现在都是20道题目
  loopToFillState(examStore, { 单选: 20, 多选: 20, 简答: 20, 判断: 20, 编程: 20 });
  togglePreviewPaper.value = true;
};
// 删除试卷
const deleteItem = (record) => {
  console.log(record);
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
