<template>
  <BasicCardVue>
    <template #title>权限列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="addUser">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增角色
        </el-button>
        <AddOrEditModal v-model:showUserModal="showUserModal" v-model:roleRecord="roleRecord"></AddOrEditModal>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-4 flex flex-col justify-between">
        <el-table :data="tableData" stripe v-loading="loading">
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateBy" label="更新人" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column prop="description" label="备注" />
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
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import AddOrEditModal from "./addOrEditModal.vue";
import { getList, deleteRole } from "@/api/roleManagement.js";
import { useUserStore } from "@/store";
const userStore = useUserStore();
//获取数据
const loading = ref(false);
const tableData = reactive([]);
const params = ref({
  pageNo: 1,
  pageSize: 10,
  userId: userStore.userId,
});
const init = async () => {
  loading.value = true;
  const res = await getList(params.value);
  console.log(res);
  if (res.code === 200) {
    tableData.push(...res.data.records);
  }
  loading.value = false;
};

const showUserModal = ref(false);
const roleRecord = ref();
const changeInfo = (record) => {
  roleRecord.value = record;
  showUserModal.value = true;
};
const deleteItem = async (record) => {
  const res = await deleteRole(record.roleId);
  console.log(record);
};
const addUser = () => {
  roleRecord.value = null;
  showUserModal.value = true;
};
init();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
