<template>
  <BasicCardVue>
    <template #title>题库列表</template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between container-leftBottomList">
        <el-table :data="tableData.value" stripe style="width: 100%" :max-height="tableHeight" v-loading="loading"
          element-loading-text="加载中...">
          <el-table-column prop="knowGory" label="知识分类" width="80">
            <template #default="scope">
              {{ mapKnowGory[scope.row.knowGory] }}
            </template>
          </el-table-column>
          <el-table-column prop="ttype" label="题目类型" width="100">
            <template #default="scope">
              {{ mapTtype[scope.row.ttype] }}
            </template>
          </el-table-column>
          <el-table-column prop="tdiff" label="题目难度" sortable :sortMethod="sortMethod1" width="120">
            <template #default="scope">
              {{ mapTdiff[scope.row.tdiff] }}
            </template>
          </el-table-column>
          <el-table-column prop="score" sortable :sortMethod="sortMethod" label="分数" width="100">
            <template #default="scope">
              {{ `${scope.row.score}分` }}
            </template>
          </el-table-column>
          <el-table-column prop="tproblem" label="题目内容" min-width="200">
            <template #default="scope">
              <div :class="['showContent', `showContent-${scope.$index}`]">
                <span v-html="scope.row.tproblem" class="content"> </span>
                <el-icon class="arrowIcon" @click="toggleArrow(scope)">
                  <ArrowDownBold v-if="!toggleArrowList[scope.$index]" />
                  <ArrowUpBold v-else />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" fixed="right" width="180" align="center">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="preview(scope.row)">查看题目</a>
              <el-divider direction="vertical" v-if="isAdded(scope.row)" />
              <a style="color: #31969a" href="javascript:;" @click="addToStore(scope.row)"
                v-if="isAdded(scope.row)">添加到试卷</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-2 pagi flex justify-end" background :page-sizes="[10, 20, 30, 40, 50]"
          :total="params.total" @currentChange="handlerPageChange" @size-change="handleSizeChange"
          layout="sizes, prev, pager, next" />
      </div>
    </template>
  </BasicCardVue>
  <IncreaseModal v-model:increaseModal="increaseModal" v-model:record="questionRecord"></IncreaseModal>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { useExamStore } from "@/store";
import IncreaseModal from "./increaseModal.vue";
import { ElMessage } from "element-plus";
import emiter from "@/utils/mitt.js";
import {
  mapKnowGory,
  mapTtype,
  mapTtypes,
  mapTdiff,
  sortMethod,
  sortMethod1,
} from "@/components/questionBankManagement/constants.js";
import { getList } from "@/api/questionBankManagement.js";
const examStore = useExamStore();
examStore.MyReset();
const tableHeight = ref(500);
onMounted(() => {
  //动态处理table高度，如果超过有滚动条！
  tableHeight.value =
    document.getElementsByClassName("container-leftBottomList")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
});
//搜索内容
emiter.on("manualRender-search", (newVal) => {
  params.value.pageNo = 1;
  params.value.ttype = newVal.type;
  params.value.tdiff = newVal.level;
  params.value.tproblem = newVal.content;
  params.value.knowGory = newVal.class;
  loadData();
});
onBeforeUnmount(() => {
  examStore.MyReset();
  emiter.off("manualRender-search");
});
//加载数据
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
    toggleArrowList.value = Array.from({ length: res.data.records.length }, () => false);
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
//预览
const preview = (record) => {
  questionRecord.value = record;
  increaseModal.value = true;
};
//处理展开内容
const toggleArrowList = ref([]);
const toggleArrow = (record) => {
  if (toggleArrowList.value[record.$index]) {
    document.querySelector(`.showContent-${record.$index}`).parentNode.style.height = "1.5rem";
  } else {
    document.querySelector(`.showContent-${record.$index}`).parentNode.style.height = "100%";
  }
  toggleArrowList.value[record.$index] = !toggleArrowList.value[record.$index];
};
// 新增
const questionRecord = ref({});
const increaseModal = ref(false);
//判断这一条是否已经添加到试卷中
const isAdded = (record) => {
  return examStore.answers[mapTtypes[record.ttype]].find((item) => item.tid === record.tid) ? false : true;
};
const addToStore = (record) => {
  const isAdded = examStore.answers[mapTtypes[record.ttype]].find((item) => item.tid === record.tid);
  if (!isAdded) {
    examStore.answers[mapTtypes[record.ttype]].push(record);
  } else {
    ElMessage.error("已经添加，禁止重复添加");
  }
};
loadData();
</script>
<style lang="less" scoped>
:deep(.el-input__inner) {
  width: 100% !important;
}

:deep(.cell) {
  height: 1.5rem;
}

.showContent {
  position: relative;
  display: flex;
  align-items: center;

  .content {
    width: 90%;
    overflow: hidden;
    white-space: break-spaces;
  }

  .arrowIcon {
    position: absolute;
    top: 5px;
    right: 0px;
  }
}
</style>
