<template>
  <div class="header-container h-full w-full">
    <div class="flex items-center">
      <!-- <img src="@/assets/image/u1181.svg" class="w-12 m-2" alt="" /> -->
      <img src="@/assets/image/u1190.svg" class="w-12 m-2" alt="" />
      <span class="header-title">考试系统</span>
      <!-- 新一代用电信息采集系统 -->
      <!-- <span class="header-title header-navigation ml-10">导航</span> -->
      <!-- <el-icon :size="20" style="color: #fff"><CaretBottom /></el-icon> -->
    </div>
    <div class="flex items-center">
      <el-popover placement="bottom" :width="400" trigger="click">
        <template #reference>
          <el-badge :value="alertIconList.value.length" :hidden="alertIconList.value.length === 0" class="alertIcon">
            <img src="@/assets/image/u1174.svg" class="w-8" alt="" />
          </el-badge>
        </template>
        <el-table :data="alertIconList.value">
          <el-table-column width="50" property="type" label="类型" />
          <el-table-column width="100" property="name" label="名称" />
          <el-table-column width="50" property="path" label="path" />
        </el-table>
      </el-popover>

      <el-dropdown class="mr-4">
        <img src="@/assets/image/u1172.svg" class="avatar" alt="" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="innerlogoutAccount">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { logoutAccount } from "./methods.js";
import { getList as reviewList } from "@/api/reviewManagement.js";
import { getList as invigilateList } from "@/api/invigilateManagement.js";
import dayjs from "dayjs";
import { useUserStore } from "@/store";
const userStore = useUserStore();
//退出登录
const innerlogoutAccount = async () => {
  if (document.getElementsByClassName("avatar")[0].className.indexOf("bounce") > -1) {
    const classs = document
      .getElementsByClassName("avatar")[0]
      .className.split(" ")
      .filter((item) => item != "bounce" && item != "animated")
      .join(" ");
    document.getElementsByClassName("avatar")[0].className = classs;
  }
  setTimeout(() => {
    document.getElementsByClassName("avatar")[0].className += " animated bounce";
  }, 0);
  await logoutAccount();
};
//消息提醒
const alertIconList = reactive({ value: [] });
const getAlertList = async () => {
  const payload = {
    pageNo: 1,
    pageSize: 100000,
  };
  const res = await Promise.all([reviewList(payload), invigilateList(payload)]);
  //实际上后端并没有做好权限，这些接口谁都能调用，但是有可能没有这两个页面的路由，所以必须再筛选一下&&userStore.menuLicenses['阅卷评分']?.includes('修改')
  if (res[0].code === 200 && res[0].success && userStore.menuLicenses["阅卷评分"]?.includes("修改")) {
    res[0].data.records.forEach((item) => {
      if (item.examStatus == "3" && dayjs(item.examEndTime).valueOf() < dayjs().valueOf()) {
        //已结束
        alertIconList.value.push({
          type: "阅卷管理",
          name: item.examName,
          path: "/reviewManagement",
        });
      }
    });
  }
  if (res[1].code === 200 && res[1].success && userStore.menuLicenses["监考管理"]?.includes("查询")) {
    res[1].data.records.forEach((item) => {
      if (
        dayjs(item.examEndTime).valueOf() > dayjs().valueOf() &&
        dayjs(item.examBeginTime).valueOf() < dayjs().valueOf() &&
        item.examType == "2"
      ) {
        //现在的时间在开始和结束之间,并且是集中考试才行
        alertIconList.value.push({
          type: "监考管理",
          name: item.examName,
          path: "/invigilateManagement",
        });
      }
    });
  }
  console.log(alertIconList.value);
};
//处理消息弹出框，现在就是考生没有这个框，然后老师有这个框，显示待阅卷、待监考这两种类型数据
onMounted(() => {
  getAlertList();
});
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
    width: 2rem;
    margin-left: 1rem;
  }
  .alertIcon {
    width: 2rem;
    cursor: pointer;
  }
  .animated {
    animation: bounce 1s infinite;
  }
  /deep/.el-input__wrapper {
    background-color: transparent;
    border-radius: 16px;
    border-color: #4fe1e4;
    box-shadow: 0 0 0 1px #4fe1e4 inset;
  }
}
</style>
