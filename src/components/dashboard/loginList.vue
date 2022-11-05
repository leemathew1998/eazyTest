<template>
  <BasicCardVue>
    <template #title>登录日志列表</template>
    <template #mainContent>
      <div class="loginList-container" ref="container" v-loading="loading">
        <div class="test">
          <div v-for="(item, index) in loginList" :key="index" class="renderItem">
            <span class="name">{{ item.username }}</span>
            <span class="main">{{ item.theGroup }}</span>
            <span class="time">{{ item.loginTime }}</span>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, onMounted, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { getLoginList } from "@/api/dashborad.js";
const loginList = reactive([]);
const loading = ref(false);
const container = ref();
onMounted(async () => {
  container.value.style.height = `${container.value.clientHeight}px`;
  // 请求数据
  loading.value = true;
  const res = await getLoginList();
  if (res.code === 200) {
    loginList.push(...res.data)
  }
  loading.value = false;
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
      flex:1;
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
    }
    .main{
      flex:1;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
    .time {
      flex:2;
      display: flex;
      justify-content: flex-end;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
