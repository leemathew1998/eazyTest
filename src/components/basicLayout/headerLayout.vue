<template>
  <div class="header-container h-full w-full">
    <div class="flex items-center">
      <img src="@/assets/image/u1181.svg" class="w-12 m-2" alt="" />
      <span class="header-title">新一代用电信息采集系统</span>
      <span class="header-title header-navigation ml-10">导航</span>
      <el-icon :size="20" style="color: #fff"><CaretBottom /></el-icon>
    </div>
    <div class="flex items-center">
      <el-input v-model="searchContent" placeholder="输入关键词搜索" class="search-warpper">
        <template #suffix>
          <el-icon :size="24" style="color: #4fe1e4"><Search /></el-icon>
        </template>
      </el-input>
      <img src="@/assets/image/u1176.svg" class="w-10 ml-4" alt="" />
      <el-badge :value="12" class="item w-10 ml-4">
        <img src="@/assets/image/u1174.svg" class="w-10" alt="" />
      </el-badge>
      <el-dropdown class="mr-4">
        <img src="@/assets/image/u1172.svg" class="w-10 m-4 avatar" alt="" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logoutAccount">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { logout } from "@/api/user.js";
import { ElNotification } from "element-plus";
import { useUserStore, useAppStore, useExamStore } from "@/store";
import { useRouter } from "vue-router";
const searchContent = ref("");
const logoutAccount = async () => {
  const res = await logout();
  if (res.code === 200) {
    ElNotification.success("退出成功！");
    const appStore = useAppStore();
    appStore.$reset();
    const examStore = useExamStore();
    examStore.$reset();
    const userStore = useUserStore();
    userStore.$reset();
    localStorage.clear();
    const router = useRouter();
    router.push("/login");
  } else {
    ElNotification.error("退出失败！");
  }
};
</script>
<style lang="less" scoped>
.header-container {
  background: url("@/assets/image/headerBackgroud.png") 0 0;
  background-size: auto;
  background-size: 100% 100%;
  background-color: #32969a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-title {
    font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    color: #ffffff;
    line-height: 18px;
  }
  .header-navigation {
    font-size: 14px;
    line-height: 14px;
  }
  .avatar {
    background-color: #3acbd0;
    border-radius: 50%;
    padding: 4px;
  }
  .search-warpper {
  }
  /deep/.el-input__wrapper {
    background-color: transparent;
    border-radius: 16px;
    border-color: #4fe1e4;
    box-shadow: 0 0 0 1px #4fe1e4 inset;
  }
}
</style>
