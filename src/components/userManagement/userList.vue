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
              <a style="color: red" href="javascript:;" @click="deleteItem(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="mt-2 mb-2" background layout="prev, pager, next" :total="1000" />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import AddOrEditModal from "./addOrEditModal.vue";
const tableData = reactive([]);
const showUserModal = ref(false);
const userRecord = ref();
for (let index = 0; index < 10; index++) {
  tableData.push({
    index: index,
    username: `第${index}`,
    userAccess: Math.random() > 0.5 ? "是" : "否",
    questionAccess: Math.random() > 0.5 ? "是" : "否",
    reviewAccess: Math.random() > 0.5 ? "是" : "否",
    role: Math.random() > 0.5 ? "用户" : "管理员",
    createdBy: "张三",
    createdTime: "2022-10-31 12:21:12",
  });
}
const changeInfo = (record) => {
  userRecord.value = record;
  showUserModal.value = true;
};
const deleteItem = (record) => {
  console.log(record);
};
const addUser = () => {
  userRecord.value = null;
  showUserModal.value = true;
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
