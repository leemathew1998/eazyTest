<template>
  <BasicCardVue>
    <template #title>题库列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="uploadModal = true" v-if="userStore.menuLicenses['题库管理']?.includes('新增')">
          <div class="relative mr-2">
            <img src="@/assets/image/u530.svg" />
            <img class="absolute" style="top: 1px; left: 1px; border: 1px solid #fff" src="@/assets/image/u531.svg" />
          </div>
          批量导入
        </el-button>
        <el-button @click="increaseModal = true" v-if="userStore.menuLicenses['题库管理']?.includes('新增')">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增题目
        </el-button>
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
        >
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

          <el-table-column prop="action" label="操作" fixed="right" width="140" align="center">
            <template #default="scope">
              <a
                style="color: #31969a"
                href="javascript:;"
                @click="changeInfo(scope.row)"
                v-if="userStore.menuLicenses['题库管理']?.includes('修改')"
                >修改</a
              >
              <el-divider direction="vertical" v-if="userStore.menuLicenses['题库管理']?.includes('修改')" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;" v-if="userStore.menuLicenses['题库管理']?.includes('删除')"
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
  <UploadModal v-model:uploadModal="uploadModal"></UploadModal>
  <IncreaseModal
    v-model:increaseModal="increaseModal"
    v-model:record="questionRecord"
    @reLoadData="loadData()"
  ></IncreaseModal>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import UploadModal from "./uploadModal.vue";
import IncreaseModal from "./increaseModal.vue";
import { getList, deleteQuestion } from "@/api/questionBankManagement.js";
import emiter from "@/utils/mitt.js";
import { useUserStore } from "@/store";
import { mapKnowGory, mapTtype, mapTdiff, sortMethod, sortMethod1 } from "./constants.js";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
//搜索内容
emiter.on("question-search", (newVal) => {
  params.value.pageNo = 1;
  params.value.ttype = newVal.type;
  params.value.tdiff = newVal.level;
  params.value.tproblem = newVal.content;
  params.value.knowGory = newVal.class;
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
  emiter.off("question-search");
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
    toggleArrowList.value = Array.from({ length: res.data.records.length }, () => false);
    tableData.value = res.data.records;
  }
  loading.value = false;
};
const changeInfo = (record) => {
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
//删除
const deleteItem = async (record) => {
  loading.value = true;
  const res = await deleteQuestion(record.tid);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    params.value.pageNo = 1;
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
// 上传和新增所需要
const uploadModal = ref(false);
const questionRecord = ref({});
const increaseModal = ref(false);
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
