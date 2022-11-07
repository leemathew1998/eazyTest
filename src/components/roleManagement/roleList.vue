<template>
  <BasicCardVue>
    <template #title>角色列表</template>
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
        <el-table :data="tableData.value" stripe v-loading="loading">
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="updateBy" label="更新人" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column prop="description" label="备注" />
          <el-table-column prop="action" label="操作" fixed="right" min-width="140">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row)">查看</a>
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row)">修改</a>
              <el-divider direction="vertical" />
              <a style="color: #31969a" href="javascript:;" @click="changePermission(scope.row)">权限管理</a>
              <el-divider direction="vertical" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;">删除</a>
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
  <PermissionManagement
    v-model:showPermissionModal="showPermissionModal"
    :permissionRoleId="permissionRoleId"
  ></PermissionManagement>
</template>
<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import emiter from "@/utils/mitt.js";
import BasicCardVue from "@/components/basicCard.vue";
import AddOrEditModal from "./addOrEditModal.vue";
import PermissionManagement from "./permissionManagement.vue";
import { getList, deleteRole } from "@/api/roleManagement.js";
import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
//搜索内容
emiter.on("role-search", (newVal) => {
  params.value.roleName = newVal.rolename;
  loadData();
});
onBeforeMount(() => {
  emiter.off("role-search");
});
//获取数据
const loading = ref(false);
const tableData = reactive({ value: [] });
const params = ref({
  pageNo: 1,
  pageSize: 10,
  userId: userStore.userId,
  total: 0,
  roleName: "",
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
//权限管理
const showPermissionModal = ref(false);
const permissionRoleId = ref(null);
const changePermission = (record) => {
  permissionRoleId.value = record.roleId;
  showPermissionModal.value = true;
};

//角色内容
const showUserModal = ref(false);
const roleRecord = ref();
const changeInfo = (record) => {
  roleRecord.value = record;
  showUserModal.value = true;
};
//删除
const deleteItem = async (record) => {
  const res = await deleteRole(record.roleId);
  if (res.code === 200) {
    ElMessage.success("角色删除成功");
  } else {
    ElMessage.error("角色删除失败");
  }
  loadData();
};
const addUser = () => {
  roleRecord.value = null;
  showUserModal.value = true;
};
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
