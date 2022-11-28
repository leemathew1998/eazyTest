<template>
  <BasicCardVue>
    <template #title>用户列表</template>
    <template #topRight>
      <div class="flex items-center mb-2">
        <el-button @click="addUser" v-if="userStore.menuLicenses['用户管理']?.includes('新增')">
          <img src="@/assets/image/xiugai_u368.svg" class="mr-2" />
          新增用户
        </el-button>
        <AddOrEditModal v-model:showUserModal="showUserModal" v-model:userRecord="userRecord" @reLoadData="loadData()">
        </AddOrEditModal>
      </div>
    </template>
    <template #mainContent>
      <div class="h-full w-full -mb-4 flex flex-col justify-between container-userList">
        <el-table :data="tableData" style="width: 100%" :max-height="tableHeight" stripe v-loading="loading"
          element-loading-text="加载中...">
          <el-table-column prop="username" label="用户名" min-width="100" />
          <el-table-column prop="phone" label="电话" min-width="120" />
          <el-table-column prop="roleName" label="角色" min-width="80" />
          <el-table-column prop="theGroup" label="组别" min-width="80" />
          <el-table-column prop="createBy" label="创建人" min-width="100" />
          <el-table-column prop="createTime" label="创建时间" min-width="170" />
          <el-table-column prop="lastLoginTime" label="上次登录时间" min-width="170">
            <template #default="scope">
              <span>{{ scope.row.lastLoginTime ? scope.row.lastLoginTime : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateBy" label="更新人" min-width="100">
            <template #default="scope">
              <span>{{ scope.row.updateBy ? scope.row.updateBy : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="170">
            <template #default="scope">
              <span>{{ scope.row.updateTime ? scope.row.updateTime : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" fixed="right" align="center" min-width="160">
            <template #default="scope">
              <a style="color: #31969a" href="javascript:;" @click="changeInfo(scope.row)"
                v-if="userStore.menuLicenses['用户管理']?.includes('修改')">修改</a>
              <el-divider direction="vertical" v-if="userStore.menuLicenses['用户管理']?.includes('删除')" />
              <el-popconfirm title="确定要删除吗？" :teleported="true" @confirm="deleteItem(scope.row)">
                <template #reference>
                  <a style="color: red" href="javascript:;" v-if="userStore.menuLicenses['用户管理']?.includes('删除')">删除</a>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <template #empty>
            <div class="flex justify-center items-center flex-col w-full">
              <el-empty :image-size="50" description="暂无数据" />
            </div>
          </template>
        </el-table>
        <el-pagination class="mt-2 mb-2 pagi flex justify-end" background :page-sizes="[10, 20, 30, 40, 50]"
          :total="params.total" @currentChange="handlerPageChange" @size-change="handleSizeChange"
          layout="sizes, prev, pager, next" />
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import emiter from "@/utils/mitt.js";
import BasicCardVue from "@/components/basicCard.vue";
import AddOrEditModal from "./addOrEditModal.vue";
import { getList, deleteUser } from "@/api/userManagement.js";
import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
//搜索内容
emiter.on("user-search", (newVal) => {
  params.value.pageNo = 1;
  params.value.username = newVal.username;
  params.value.theGroup = newVal.class;
  params.value.phone = newVal.phone;
  params.value.roleId = newVal.role;
  loadData();
});
const tableHeight = ref(500);
onMounted(() => {
  //动态处理table高度，如果超过有滚动条！
  tableHeight.value =
    document.getElementsByClassName("container-userList")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
  loadData();
});
//监听窗口大小变化,动态处理table高度
window.onresize = () => {
  tableHeight.value =
    document.getElementsByClassName("container-userList")[0].offsetHeight -
    document.getElementsByClassName("pagi")[0].offsetHeight;
};
onBeforeUnmount(() => {
  emiter.off("user-search");
});
//请求数据
const tableData = ref([]);
const loading = ref(false);
const showUserModal = ref(false);
const userRecord = ref();
const params = ref({
  total: 0,
  pageNo: 1,
  pageSize: 10,
  username: "",
  theGroup: "",
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
const handleSizeChange = (size) => {
  params.value.pageNo = 1;
  params.value.pageSize = size;
  loadData();
};
//修改用户信息
const changeInfo = (record) => {
  userRecord.value = record;
  showUserModal.value = true;
};
//删除
const deleteItem = async (record) => {
  loading.value = true;
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
  userRecord.value = null;
  showUserModal.value = true;
};
</script>
<style lang="less" scoped>
:deep(.el-input__inner) {
  width: 100% !important;
}
</style>
