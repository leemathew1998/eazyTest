<template>
  <BasicCardVue>
    <template #title>登录日志列表</template>
    <template #mainContent>
      <div class="loginList-container" ref="container">
        <div class="test">
          <div v-for="(item, index) in loginList" :key="index" class="renderItem">
            <span class="name">{{ item.name }}</span>
            <span class="time">{{ item.group }}</span>
            <span class="time">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
const loginList = reactive([]);

const container = ref();
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  for (let index = 0; index < 100; index++) {
    loginList.push({
      name: `胡鑫悦${index}`,
      group: "应用组",
      time: "2022-12-24 12:09:10",
    });
  }
});
</script>
<style lang="less" scoped>
.test {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  overflow: scroll;
}
.loginList-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  .renderItem {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 1rem;
    width: 32%;
    margin-bottom: 1rem;
    .name {
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
    }
    .time {
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
