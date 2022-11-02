<template>
  <BasicCardVue>
    <template #title>在线考试</template>
    <template #topRight>
      <div class="rightLink">
        <a>查看公告</a>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </template>
    <template #mainContent>
      <div class="onlineList-container" ref="container">
        <div class="test">
          <!-- loop -->
          <div v-for="item in renderList" :key="item.index" class="w-full">
            <div class="flex justify-between items-center">
              <div>
                <div class="flex items-center mb-4">
                  <span class="examName">{{ item.examName }}</span>
                  <span class="type" :style="{ backgroundColor: item.type === '可参加' ? '#45D6B6' : '#F7B502' }">{{
                    item.type
                  }}</span>
                </div>
                <span class="timeRanges">{{ item.timeRanges }}</span>
              </div>
              <el-button type="primary" size="default" @click="intoExam">进入</el-button>
            </div>
            <el-divider direction="horizontal" content-position="center"></el-divider>
          </div>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import BasicCardVue from "@/components/basicCard.vue";
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const renderList = reactive([]);
const container = ref();
onMounted(() => {
  container.value.style.height = `${container.value.clientHeight}px`;
  for (let i = 0; i < 20; i++) {
    renderList.push({
      index: i,
      examName: "2022年前端技术10月考试" + i,
      timeRanges: "2022-10-25 12:30:00-13:30:00",
      type: Math.random() > 0.5 ? "可参加" : "未参加",
    });
  }
});
const intoExam = () => {
  router.push("/exam/examing");
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.onlineList-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  .test {
    // flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    overflow: scroll;
    .examName {
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: #333333;
    }
    .type {
      background-color: red;
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      color: #ffffff;
      font-size: 14px;
      padding: 0px 8px;
      margin-left: 1rem;
      border-radius: 16px;
    }
    .timeRanges {
      font-family: "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      color: #333333;
      text-align: left;
    }
  }
}
.rightLink {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #31969a;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #31969a;
  font-size: 14px;
  cursor: pointer;
}
/deep/.el-divider--horizontal {
  margin: 8px 0px;
}
</style>
