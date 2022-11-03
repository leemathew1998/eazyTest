<template>
  <div class="headerBreadcrumb-container">
    <div class="breadcrumb flex items-center justify-start p-2">
      <img
        src="@/assets/image/u1190.svg"
        class="w-4"
        alt=""
        @click="gotoPage('/dashboard')"
      />
      <el-divider direction="vertical" />
      <div class="flex items-center justify-start">
        <div
          v-for="(item, index) in editableTabs"
          :key="item.path"
          :class="['tab-item', activeTab === item.path ? 'active' : '']"
          @click="gotoPage(item.path)"
        >
          <span class="tab-item-name">{{ item.name }}</span>
          <el-icon class="ml-2" @click.stop="closeTab(index)"
            ><Close
          /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
const store = useAppStore();
const route = useRoute();
const router = useRouter();
const activeTab = ref();
const editableTabs = computed(() => {
  activeTab.value = route.path;
  return store.returnRoutes;
});
const closeTab = (index) => {
  // 此处需要看如果当前页面就是所删除的页面，即需要再把页面也给跳转了
  if (editableTabs.value[index].path === route.path) {
    // 确保菜单数量大于1，要不然就空了
    if (editableTabs.value.length > 1) {
      router.push(editableTabs.value[index - 1].path);
    } else {
      return;
    }
  }
  store.spliceRoutes(index);
};
const gotoPage = (path) => {
  router.push(path);
};
</script>
<style lang="less" scoped>
.headerBreadcrumb-container {
  background-color: #f4f4f4;
  padding: 1rem 1rem 0.5rem 1rem;
  .breadcrumb {
    background-color: #fff;
    border-width: 0px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    -moz-box-shadow: 0px 2px 8px rgba(3, 43, 36, 0.0666666666666667);
    -webkit-box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
    box-shadow: 0px 2px 8px rgb(3 43 36 / 7%);
  }
  .tab-item {
    margin-right: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: rgba(240, 240, 240, 1);
    border-radius: 6px;
    box-shadow: none;
    font-family: "SourceHanSansCN-Normal", "Source Han Sans CN Normal",
      "Source Han Sans CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    text-align: left;
    align-self: center;
    padding: 4px 8px 4px 16px;
    box-sizing: border-box;
  }
  .active {
    background-color: #1eb7ab;
    color: #fff;
  }
}
/deep/.el-divider--vertical {
  height: 1.2em;
}
</style>
