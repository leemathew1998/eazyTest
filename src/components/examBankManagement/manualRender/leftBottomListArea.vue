<template>
  <BasicCardVue>
    <template #title>题库列表</template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between">
        <el-table :data="tableData.value" stripe style="width: 100%" max-height="5000" v-loading="loading">
          <el-table-column prop="knowGory" label="知识分类">
            <template #default="scope">
              {{ mapKnowGory[scope.row.knowGory] }}
            </template>
          </el-table-column>
          <el-table-column prop="ttype" label="题目类型">
            <template #default="scope">
              {{ mapTtype[scope.row.ttype] }}
            </template>
          </el-table-column>
          <el-table-column prop="tdiff" label="题目难度">
            <template #default="scope">
              {{ mapTdiff[scope.row.tdiff] }}
            </template>
          </el-table-column>
          <el-table-column prop="tproblem" label="题目内容">
            <template #default="scope">
              <span>
                {{ solveChineseWord(scope.row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="useNum" sortable :sortMethod="sortMethod1" label="使用次数">
            <template #default="scope">
              {{ `${scope.row.useNum}次` }}
            </template>
          </el-table-column>
          <el-table-column prop="score" sortable :sortMethod="sortMethod" label="分数">
            <template #default="scope">
              {{ `${scope.row.score}分` }}
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="180" align="center">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="preview(scope.row)">查看题目</a>
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="addToStore(scope.row)">添加到试卷</a>
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
  <IncreaseModal v-model:increaseModal="increaseModal" v-model:record="questionRecord"></IncreaseModal>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";
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

//如果是编程题，那就需要处理一下，把html转成汉字
const chineseWordReg = /[\u4e00-\u9fa5]/g;
const solveChineseWord = (record) => {
  if (record.ttype == 5) {
    return record.tproblem.match(chineseWordReg).join("");
  } else {
    return record.tproblem;
  }
};
//搜索内容
emiter.on("manualRender-search", (newVal) => {
  params.value.ttype = newVal.type;
  params.value.tdiff = newVal.level;
  params.value.tproblem = newVal.content;
  params.value.knowGory = newVal.class;
  loadData();
});
onBeforeUnmount(() => {
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
  }
  loading.value = false;
};
//分页
const handlerPageChange = (pageNo) => {
  params.value.pageNo = pageNo;
  loadData();
};

const preview = (record) => {
  questionRecord.value = record;
  increaseModal.value = true;
};
// 新增
const questionRecord = ref({});
const increaseModal = ref(false);

const addToStore = (record) => {
  const isAdded = examStore.answers[mapTtypes[record.ttype]].find((item) => item.index === record.index);
  if (!isAdded) {
    examStore.answers[mapTtypes[record.ttype]].push(record);
  } else {
    ElMessage.error("已经添加，禁止重复添加");
  }
};
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
