<template>
  <div class="asideLayout-container ml-4 h-full flex">
    <!-- 此处的动态类很不优雅，后期考虑替换掉。。。 -->
    <div
      v-for="(item, index) in menuList"
      :key="item.name"
      :class="['menu-item', item.path === activeMenu ? 'active' : '', index === 0 ? 'activeBorder' : '']"
      @click="changeMenu(item)"
    >
      <span class="item-title">{{ item.name }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useAppStore } from "@/store/index";

const store = useAppStore();
const router = useRouter();
const menuList = ref();
const menusName = ["首页", "用户管理", "角色管理", "题库管理", "试卷管理", "阅卷评分", "监考管理", "成绩查询"];
// 获取现在的路由进行渲染。
onMounted(() => {
  // 对路由进行渲染，需要展示main中的但是要排除已经删除的。
  menuList.value = router.getRoutes().filter((route) => menusName.includes(route.name));
});

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
  name: route.name,
  path: route.path,
});
onBeforeRouteUpdate((to) => {
  store.solveRoutes({
    name: to.name,
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
