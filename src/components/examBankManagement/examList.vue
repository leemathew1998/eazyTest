<template>
  <BasicCardVue>
    <template #title>试卷列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="showExamModal = true" v-if="userStore.menuLicenses['试卷管理']?.includes('新增')">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增试卷
        </el-button>
        <PrintExam
          v-model:showExamModal="showExamModal"
          @reLoadData="loadData()"
          v-model:record="updateRecord"
        ></PrintExam>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between container">
        <el-table
          :data="tableData.value"
          stripe
          style="width: 100%"
          :max-height="tableHeight"
          :default-sort="{ prop: 'useCount', order: 'descending' }"
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column prop="examPaperName" label="试卷名称" min-width="200" />
          <el-table-column prop="sum" label="试卷分数" width="80">
            <template #default="scope"> {{ scope.row.sum }}分 </template>
          </el-table-column>
          <el-table-column prop="knowGory" label="知识分类" width="80">
            <template #default="scope">
              {{ mapKnowGory[scope.row.knowGory] }}
            </template>
          </el-table-column>
          <el-table-column prop="diff" label="试卷难度" width="80">
            <template #default="scope">
              {{ solveHardLevel(Number(scope.row.diff)) }}
            </template>
          </el-table-column>
          <el-table-column prop="userNum" sortable label="使用次数" min-width="110" :sortMethod="sortMethod0">
            <template #default="scope">
              {{ `${scope.row.userNum ? scope.row.userNum : 0}次` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="singleTnum"
            label="单选题"
            sortable
            :sortMethod="sortMethod1"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ `${scope.row.singleTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="moreTnum"
            label="多选题"
            sortable
            :sortMethod="sortMethod2"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ `${scope.row.moreTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="judgeTnum"
            label="判断题"
            sortable
            :sortMethod="sortMethod3"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ `${scope.row.judgeTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ansTnum"
            label="简答题"
            sortable
            :sortMethod="sortMethod4"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ `${scope.row.ansTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="programTnum"
            label="编程题"
            sortable
            :sortMethod="sortMethod5"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ `${scope.row.programTnum}个` }}
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" min-width="170" />
          <el-table-column prop="updateBy" label="修改人" >
            <template #default="scope">
              {{ scope.row.updateBy ? scope.row.updateBy : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" min-width="170" >
            <template #default="scope">
              {{ scope.row.updateTime ? scope.row.updateTime : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" fixed="right" min-width="220" align="center">
            <template #default="scope">
              <a
                style="color: #31969a"
                href="javascript:;"
                @click="newExam(scope.row)"
                v-if="userStore.menuLicenses['监考管理']?.includes('新增')"
                >新建考试</a
              >
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="previewExam(scope.row)" class="animated bounce"
                >预览</a
              >
              <el-divider direction="vertical" v-if="userStore.menuLicenses['试卷管理']?.includes('修改')" />
              <a
                style="color: #31969a"
                href="javascript:;"
                v-if="userStore.menuLicenses['试卷管理']?.includes('修改')"
                @click="updateExam(scope.row)"
                class="animated bounce"
                >修改</a
              >
              <el-divider direction="vertical" v-if="userStore.menuLicenses['试卷管理']?.includes('删除')" />
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
  <PreviewPaperVue v-model:togglePreviewPaper="togglePreviewPaper" :tids="tids"></PreviewPaperVue>
  <NewExamModal v-model:toggleExamModal="toggleExamModal" :record="newExamRecord"></NewExamModal>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import PrintExam from "./PrintExam.vue";
import PreviewPaperVue from "./previewPaper.vue";
import { useExamStore, useUserStore } from "@/store";
import NewExamModal from "./newExamModal.vue";
import { getList, deleteExam } from "@/api/examBankManagement.js";
import { mapKnowGory } from "@/components/questionBankManagement/constants.js";
import { ElMessage } from "element-plus";
import emiter from "@/utils/mitt.js";
import { sortMethod0, sortMethod1, sortMethod2, sortMethod3, sortMethod4, sortMethod5 } from "./methods.js";
import { useRouter } from "vue-router";
const router = useRouter();
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
  params.value.pageNo = 1;
  params.value.knowGory = newVal.class;
  params.value.level = newVal.level;
  loadData();
});
const tableHeight = ref(500);
onMounted(() => {
  //动态处理table高度，如果超过有滚动条！
  tableHeight.value =
    document.getElementsByClassName("container")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
  setTimeout(() => {
    loadData();
  }, 0);
});
onBeforeUnmount(() => {
  emiter.off("exam-search");
});
//处理难度，从1到100，分为三段
const solveHardLevel = (num) => {
  if (num <= 33) {
    return "简单";
  } else if (num > 33 && num <= 66) {
    return "中等";
  } else {
    return "困难";
  }
};

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
const newExamRecord = ref();
const toggleExamModal = ref(false);
const newExam = (record) => {
  toggleExamModal.value = true;
  newExamRecord.value = record;
};
// 预览试卷
const togglePreviewPaper = ref(false);
const tids = ref();
const previewExam = (record) => {
  tids.value = record.tids;
  togglePreviewPaper.value = true;
};
//修改试卷
const updateExam = (record) => {
  router.push(`/exam/manualRenderPaper?record=${JSON.stringify(record)}`);
};
// 删除试卷
const deleteItem = async (record) => {
  loading.value = true;
  const res = await deleteExam(record.examPaperId);
  if (res.code === 200) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  loadData();
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
:deep(.el-input__inner) {
  width: 100% !important;
}
</style>
