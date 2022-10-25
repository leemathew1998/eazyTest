<template>
  <div class="asideLayout-container ml-4 h-full flex">
    <!-- 此处的动态类很不优雅，后期考虑替换掉。。。 -->
    <div
      v-for="item in menuList"
      :key="item.title"
      :class="[
        'menu-item',
        item.path === activeMenu ? 'active' : '',
        item.path === '/dashboard' ? 'activeBorder' : '',
      ]"
      @click="changeMenu(item.path)"
    >
      <span class="item-title">{{ item.title }}</span>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter,useRoute } from 'vue-router'
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
    title: "题库管理",
    path: "/questionBankManagement",
  },
  {
    title: "试卷管理",
    path: "/examBankManagement",
  },
  {
    title: "阅卷管理",
    path: "/reviewManagement",
  },
  {
    title: "成绩展示",
    path: "/scoreManagement",
  },
]);

const router = useRouter()
const route = useRoute()
const activeMenu = ref();
activeMenu.value = route.path
const changeMenu = (path) => {
  activeMenu.value = path;
  router.push(path)
};
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
