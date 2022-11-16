<template>
  <BasicCard>
    <template #title> 异常情况报告 </template>
    <template #mainContent>
      <div class="exception-list-container" ref="container">
        <div class="test">
          <div
            v-for="(item, index) in exceptionList"
            :key="item.username"
            class="flex items-center justify-between w-full mb-2"
          >
            <span :class="['item-title', item.level > 0.5 ? 'item-title-blue' : '']">异常情况</span>
            <span class="item-name">{{ item.username }}</span>
            <span class="item-name">{{ item.time }}</span>
            <a class="item-link" @click="openModal(item)">查看</a>
          </div>
        </div>
      </div>
    </template>
  </BasicCard>
</template>
<script setup>
import BasicCard from "./basicCard.vue";
import { reactive, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { ElMessageBox, ElMessage } from "element-plus";
const exceptionList = reactive([]);
const container = ref();
onMounted(() => {
  if (container.value.clientHeight !== 0) {
    container.value.style.height = `${container.value.clientHeight}px`;
  }
  for (let i = 0; i < 50; i++) {
    exceptionList.push({
      level: Math.random(),
      username: Math.floor(Math.random() * 100),
      time: dayjs().format("HH:mm:ss"),
    });
  }
});
//打开弹窗
const openModal = (item) => {
  ElMessageBox.alert("页面切换", "异常行为", {
    confirmButtonText: "确定",
    callback: (action) => {
      ElMessage({
        type: "info",
        message: `action: ${action}`,
      });
    },
  });
};
</script>
<style lang="less" scoped>
.exception-list-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  margin-bottom: -1rem;
  height: 100%;
  .test {
    width: 100%;
    overflow: scroll;
    .item-title {
      padding: 4px 16px;
      border-radius: 16px;
      display: flex;
      font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
      font-weight: 400;
      font-style: normal;
      color: #ffffff;
      background-color: red;
      font-size: 13px;
      letter-spacing: normal;
      text-align: center;
      line-height: normal;
      text-transform: none;
    }
    .item-title-blue {
      background-color: #0091ff;
    }
    .item-name {
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #333333;
    }
    .item-link {
      cursor: pointer;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      text-decoration: underline;
      color: #31969a;
      text-align: center;
    }
  }
}
</style>
