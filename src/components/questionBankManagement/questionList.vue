<template>
  <BasicCardVue>
    <template #title>题库列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="uploadModal = true">
          <div class="relative mr-2">
            <img src="@/assets/image/u530.svg" />
            <img class="absolute" style="top: 1px; left: 1px; border: 1px solid #fff" src="@/assets/image/u531.svg" />
          </div>
          批量导入
        </el-button>
        <el-button @click="increaseModal = true">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增题目
        </el-button>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-8 flex flex-col justify-between">
        <el-table :data="tableData" stripe :default-sort="{ prop: 'useCount', order: 'descending' }">
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="level" label="题目难度" />
          <el-table-column prop="class" label="知识分类" />
          <el-table-column prop="content" label="题目内容" />
          <el-table-column prop="useCount" sortable label="使用次数">
            <template #default="scope">
              {{ `${scope.row.useCount}次` }}
            </template>
          </el-table-column>
          <el-table-column prop="score" label="分数" />
          <el-table-column prop="createdBy" label="创建人" />
          <el-table-column prop="createdTime" label="创建时间" min-width="180" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="140">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row)">修改信息</a>
              <el-divider direction="vertical" />
              <a style="color: red" href="javascript:;" @click="deleteItem(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-4" background layout="prev, pager, next" :total="1000" />
      </div>
    </template>
  </BasicCardVue>
  <UploadModal v-model:uploadModal="uploadModal"></UploadModal>
  <IncreaseModal v-model:increaseModal="increaseModal" v-model:record="questionRecord"></IncreaseModal>
</template>
<script setup>
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import UploadModal from "./uploadModal.vue";
import IncreaseModal from "./increaseModal.vue";
import { getList } from "@/api/questionBankManagement.js";
import emiter from "@/utils/mitt.js";
//搜索内容
emiter.on("role-search", (newVal) => {
  params.value.roleName = newVal.rolename;
  loadData();
});
onBeforeUnmount(() => {
  emiter.off("role-search");
});
//加载数据
const tableData = reactive({
  value: [],
});
const params = {
  pageNo: 1,
  pageSize: 10,
  total: 0,
};
const loadData = async () => {
  const res = await getList(params);
  console.log(res);
};
const changeInfo = (record) => {
  questionRecord.value = record;
  increaseModal.value = true;
};
const deleteItem = (record) => {
  console.log(record);
};

// 上传
const uploadModal = ref(false);
// 新增
const questionRecord = ref({});
const increaseModal = ref(false);
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
