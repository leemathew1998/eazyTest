<template>
  <div class="asideLayout-container ml-4 h-full flex">
    <!-- 此处的动态类很不优雅，后期考虑替换掉。。。 -->
    <div
      v-for="item in menuList"
      :key="item.title"
      :class="['menu-item', item.path === activeMenu ? 'active' : '', item.path === '/dashboard' ? 'activeBorder' : '']"
      @click="changeMenu(item)"
    >
      <span class="item-title">{{ item.title }}</span>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, watchEffect } from "vue";

import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useAppStore } from "@/store/index";
const menuList = reactive([
  {
    title: "首页",
    path: "/dashboard",
  },
  {
    title: "用户管理",
    path: "/userManagement",
  },
  {
    title: "权限管理",
    path: "/roleManagement",
  },
  {
    title: "题库管理",
    path: "/questionBankManagement",
  },
  {
    title: "试卷管理",
    path: "/examBankManagement",
  },
  {
    title: "阅卷评分",
    path: "/reviewManagement",
  },
  {
    title: "监考管理",
    path: "/invigilateManagement",
  },
  {
    title: "成绩查询",
    path: "/scoreManagement",
  },
  {
    title: "用户页面(临时)",
    path: "/exam/userManagement",
  },
  {
    title: "考试页面(临时)",
    path: "/exam/examing",
  },
]);
const store = useAppStore();
const router = useRouter();
const route = useRoute();
const activeMenu = ref();
const changeMenu = (record) => {
  /*
   *@Author: jkwei
   *@Date: 2022-10-25 19:22:04
   *@Description: 切换页面时还需要对面包屑进行处理，此处代码全部移到store内部进行
   */
  store.solveRoutes(record);
  activeMenu.value = record.path;
  router.push(record.path);
};
changeMenu({
  title: route.name,
  path: route.path,
});
onBeforeRouteUpdate((to) => {
  store.solveRoutes({
    title: to.name,
    path: to.path,
  });
  activeMenu.value = to.path;
});
</script>
<style lang="less" scoped>
.asideLayout-container {
  background-color: #fff;
  border-width: 0px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  -moz-box-shadow: 0px 2px 8px rgba(3, 43, 36, 0.0666666666666667);
  -webkit-box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
  box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
  flex-direction: column;
  align-items: center;
  .menu-item {
    display: flex;
    width: 100%;
    justify-content: center;
    cursor: pointer;
    padding: 12px 24px;
    .item-title {
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      text-align: center;
    }
  }
  .active {
    background-color: rgba(31, 183, 171, 1);
    color: #fff;
  }
  .activeBorder {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}
</style>
