<template>
  <BasicCardVue>
    <template #title>登录日志列表</template>
    <template #mainContent>
      <div class="loginList-container">
        <div
          v-for="(item, index) in loginList"
          :key="index"
          class="flex justify-between"
        >
          <span class="name">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
const loginList = reactive([]);
for (let index = 0; index < 30; index++) {
  loginList.push({
    name: "胡鑫悦",
    time: "2022-12-24 12:09:10",
  });
}
</script>
<style lang="less" scoped>
.loginList-container {
  margin-bottom: 2em;
  .name {
    font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
  }
  .time {
    font-family: "思源黑体 CN", sans-serif;
    font-weight: 400;
    color: #999999;
  }
}
</style>
