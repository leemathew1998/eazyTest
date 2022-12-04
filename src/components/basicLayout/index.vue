<template>
  <el-container class="w-full h-full el-container">
    <el-header>
      <!-- <KeepAlive> -->
        <HeaderLayoutVue></HeaderLayoutVue>
      <!-- </KeepAlive> -->
    </el-header>
    <HeaderBreadcrumb></HeaderBreadcrumb>
    <el-container class="pb-4">
      <el-aside width="200px">
        <AsideLayoutVue></AsideLayoutVue>
      </el-aside>
      <el-main>
        <router-view> </router-view>
        <!-- #default="{ route, Component }" -->
        <!-- <Transition mode="out-in" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight">
            <component :is="Component"></component>
          </Transition> -->

      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import HeaderBreadcrumb from "./headerBreadcrumb.vue";
import AsideLayoutVue from "./asideLayout.vue";
import HeaderLayoutVue from "./headerLayout.vue";
</script>
<style lang="less" scoped>
.el-container {
  min-height: 100%;
  max-height: 120%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 0px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #e5e5e5;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #ffffff;
  }
}

/deep/.el-header {
  padding: 0px;
}

/deep/.el-container {
  background-color: #f4f4f4;
  overflow-y: hidden;
}

/deep/.el-main {
  overflow: hidden;
  padding: 0 16px;
}
</style>
