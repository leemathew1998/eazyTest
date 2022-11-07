<template>
  <BasicCardVue>
    <template #title>用户列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="addUser" v-if="userStore.menuLicenses['用户管理'].includes('新增')">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增用户
        </el-button>
        <AddOrEditModal
          v-model:showUserModal="showUserModal"
          v-model:userRecord="userRecord"
          :userRecordReadOnly="userRecordReadOnly"
        ></AddOrEditModal>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full -mb-4 flex flex-col justify-between">
        <el-table :data="tableData" style="width: 100%" max-height="5000" stripe v-loading="loading">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="password" label="密码">
            <template #default="scope">
              <span>****</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="120" />
          <el-table-column prop="roleId" label="角色" />
          <el-table-column prop="theGroup" label="组别" />
          <el-table-column prop="createBy" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column prop="lastLoginTime" label="上次登录时间" width="160" />
          <el-table-column prop="updateBy" label="更新人" />
          <el-table-column prop="updateTime" label="更新时间" width="160" />
          <el-table-column prop="action" label="操作" fixed="right" width="220">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row, true)">查看</a>
              <el-divider direction="vertical" />
              <a
                style="color: #31969a"
                href="javascript:;"
                @click="changeInfo(scope.row, false)"
                v-if="userStore.menuLicenses['用户管理'].includes('修改')"
                >修改</a
              >
              <el-divider direction="vertical" />
              <a
                style="color: #31969a"
                href="javascript:;"
                @click="roleContrl(scope.row)"
                v-if="userStore.menuLicenses['用户管理'].includes('分配角色')"
                >角色管理</a
              >
              <el-divider direction="vertical" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;" v-if="userStore.menuLicenses['用户管理'].includes('删除')"
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
  <RoleDispach v-model:roleContrlModal="roleContrlModal" :userRecord="userRecord"></RoleDispach>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount } from "vue";
import emiter from "@/utils/mitt.js";
import BasicCardVue from "@/components/basicCard.vue";
import RoleDispach from "./roleDispach.vue";
import AddOrEditModal from "./addOrEditModal.vue";
import { getList, deleteUser } from "@/api/userManagement.js";
import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
//搜索内容
emiter.on("user-search", (newVal) => {
  loadData();
});
onBeforeUnmount(() => {
  emiter.off("user-search");
});
//请求数据
const tableData = ref([]);
const loading = ref(false);
const showUserModal = ref(false);
const userRecord = ref();
const userRecordReadOnly = ref(false);
const params = ref({
  total: 0,
  pageNo: 1,
  pageSize: 10,
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
//分页
const handlerPageChange = (pageNo) => {
  params.value.pageNo = pageNo;
  loadData();
};
//修改用户信息
const changeInfo = (record, readOnly) => {
  userRecordReadOnly.value = readOnly;
  userRecord.value = record;
  showUserModal.value = true;
};
//删除
const deleteItem = async (record) => {
  const res = await deleteUser(record.userId);
  if (res.code === 200) {
    ElMessage.success("删除成功！");
  } else {
    ElMessage.error("删除失败");
  }
  loadData();
};
//新增
const addUser = () => {
  userRecordReadOnly.value = false;
  userRecord.value = null;
  showUserModal.value = true;
};
//open role management modal
const roleContrlModal = ref(false);
const roleContrl = (record) => {
  userRecord.value = record;
  roleContrlModal.value = true;
};
loadData();
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
