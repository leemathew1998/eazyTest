<template>
  <BasicCardVue>
    <template #title>试卷列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="showExamModal = true" v-if="userStore.menuLicenses['试卷管理']?.includes('新增')">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增试卷
        </el-button>
        <PrintExam v-model:showExamModal="showExamModal"></PrintExam>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between">
        <el-table
          :data="tableData.value"
          stripe
          style="width: 100%"
          max-height="5000"
          :default-sort="{ prop: 'useCount', order: 'descending' }"
          v-loading="loading"
        >
          <el-table-column prop="examPaperName" label="试卷名称" min-width="100" />
          <el-table-column prop="knowGory" label="知识分类" min-width="80">
            <template #default="scope">
              {{ mapKnowGory[scope.row.knowGory] }}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="试卷难度" />
          <el-table-column prop="historyScore" sortable label="历次考试平均分" min-width="150">
            <template #default="scope">
              {{ `${scope.row.historyScore}分` }}
            </template>
          </el-table-column>
          <el-table-column prop="useCount" sortable label="使用次数" min-width="110">
            <template #default="scope">
              {{ `${scope.row.useCount}次` }}
            </template>
          </el-table-column>
          <el-table-column prop="singleTnum" label="单选题个数" sortable :sortMethod="sortMethod1" min-width="120">
            <template #default="scope">
              {{ `${scope.row.singleTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="moreTnum" label="多选题个数" sortable :sortMethod="sortMethod2" min-width="120">
            <template #default="scope">
              {{ `${scope.row.moreTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="judgeTnum" label="判断题个数" sortable :sortMethod="sortMethod3" min-width="120">
            <template #default="scope">
              {{ `${scope.row.judgeTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="ansTnum" label="简答题个数" sortable :sortMethod="sortMethod4" min-width="120">
            <template #default="scope">
              {{ `${scope.row.ansTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="programTnum" label="编程题个数" sortable :sortMethod="sortMethod5" min-width="120">
            <template #default="scope">
              {{ `${scope.row.programTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" min-width="170" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="200" align="center">
            <template #default="scope">
              <a
                style="color: #31969a"
                href="javascript:;"
                @click="newExam(scope.row)"
                v-if="userStore.menuLicenses['监考管理']?.includes('新增')"
                >新建考试</a
              >
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="previewExam(scope.row)">预览</a>
              <el-divider direction="vertical" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;" v-if="userStore.menuLicenses['试卷管理']?.includes('删除')"
                    >删除</a
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt-2 mb-2"
          background
          :total="params.total"
          :pageSize="10"
          @currentChange="handlerPageChange"
          layout="prev, pager, next"
        />
      </div>
    </template>
  </BasicCardVue>
  <PreviewPaperVue v-model:togglePreviewPaper="togglePreviewPaper"></PreviewPaperVue>
  <NewExamModal v-model:toggleExamModal="toggleExamModal"></NewExamModal>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import PrintExam from "./PrintExam.vue";
import PreviewPaperVue from "./previewPaper.vue";
import { useExamStore, useUserStore } from "@/store";
import { loopToFillState } from "@/utils/methods.js";
import NewExamModal from "./newExamModal.vue";
import { getList, deleteExam } from "@/api/examBankManagement.js";
import { mapKnowGory } from "@/components/questionBankManagement/constants.js";
import { ElMessage } from "element-plus";
import emiter from "@/utils/mitt.js";
import { sortMethod1, sortMethod2, sortMethod3, sortMethod4, sortMethod5 } from "./methods.js";
const examStore = useExamStore();
const userStore = useUserStore();
const showExamModal = ref(false);
const tableData = reactive({ value: [] });
const loading = ref(false);
const params = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
//搜索内容
emiter.on("exam-search", (newVal) => {
  params.value.examPaperName = newVal.name;
  params.value.knowGory = newVal.class;
  params.value.level = newVal.level;
  loadData();
});
onBeforeUnmount(() => {
  emiter.off("exam-search");
});

//加载数据
const loadData = async () => {
  loading.value = true;
  const res = await getList(params.value);
  if (res.code === 200) {
    params.value.total = res.data.total;
    tableData.value = res.data.records;
  }
  loading.value = false;
};

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
const deleteItem = async (record) => {
  const res = await deleteExam(record.examPaperId);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    loadData();
  } else {
    ElMessage.error("删除失败");
  }
};
//分页
const handlerPageChange = (pageNo) => {
  params.value.pageNo = pageNo;
  loadData();
};
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
