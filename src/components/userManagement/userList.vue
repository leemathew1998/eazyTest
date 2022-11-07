<template>
  <BasicCardVue>
    <template #title>用户列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="addUser">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增用户
        </el-button>
        <AddOrEditModal v-model:showUserModal="showUserModal" v-model:userRecord="userRecord"></AddOrEditModal>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-4 flex flex-col justify-between">
        <el-table :data="tableData" stripe>
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="userAccess" label="用户管理">
            <template #default="scope">
              <el-icon>
                <SuccessFilled style="color: #68c33a" v-if="scope.row.userAccess === '是'" />
                <CircleCloseFilled style="color: red" v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="questionAccess" label="题库管理">
            <template #default="scope">
              <el-icon>
                <SuccessFilled style="color: #68c33a" v-if="scope.row.questionAccess === '是'" />
                <CircleCloseFilled style="color: red" v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="examAccess" label="试卷管理">
            <template #default="scope">
              <el-icon>
                <SuccessFilled style="color: #68c33a" v-if="scope.row.examAccess === '是'" />
                <CircleCloseFilled style="color: red" v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="reviewAccess" label="阅卷管理">
            <template #default="scope">
              <el-icon>
                <SuccessFilled style="color: #68c33a" v-if="scope.row.reviewAccess === '是'" />
                <CircleCloseFilled style="color: red" v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="createdBy" label="创建人" />
          <el-table-column prop="createdTime" label="创建时间" min-width="180" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="140">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row)">修改信息</a>
              <el-divider direction="vertical" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;">删除</a>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-2" background layout="prev, pager, next" :total="1000" />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import emiter from "@/utils/mitt.js";
import BasicCardVue from "@/components/basicCard.vue";
import AddOrEditModal from "./addOrEditModal.vue";
import { getList, deleteUser } from "@/api/userManagement.js";

var numberList = 1000000000;

var worker = new Worker("./code.js");

worker.postMessage(numberList);
worker.onmessage = function (event) {
  console.log(event.data);
};

worker.onerror = function (event) {
  console.error(event.filename + ":" + event.message);
  //如果发生错误,立即终止代码
  worker.terminate();
};

//搜索内容
emiter.on("user-search", (newVal) => {});
onBeforeUnmount(() => {
  emiter.off("user-search");
});
//请求数据
const tableData = reactive([]);
const showUserModal = ref(false);
const userRecord = ref();
const loadData = async () => {
  const res = await getList();
};

const changeInfo = (record) => {
  userRecord.value = record;
  showUserModal.value = true;
};
const deleteItem = async (record) => {
  const res = await deleteUser(record.roleId);
  if (res.code === 200) {
    ElMessage.success("角色删除成功");
  } else {
    ElMessage.error("角色删除失败");
  }
  loadData();
  console.log(record);
};
const addUser = () => {
  userRecord.value = null;
  showUserModal.value = true;
};
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
