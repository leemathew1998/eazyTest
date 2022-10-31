<template>
  <BasicCardVue>
    <template #title>阅卷列表</template>
    <template #mainContent>
      <div class="flex-col flex audit-container mb-4">
        <div v-for="(item, index) in auditList" class="flex items-center justify-between m-2 shadow-md p-4 audit-item">
          <!-- left -->
          <div class="relative flex">
            <img src="@/assets/image/u727.svg" alt="" />
            <p class="absolute top-0 left-0 mark">最新</p>
            <img src="@/assets/image/u728.svg" alt="" class="absolute top-0 left-0" />
            <!-- 标题 -->
            <div class="flex flex-col ml-4 justify-between">
              <h3 style="font-size: 18px">{{ item.title }}</h3>
              <h5 class="item-h5">{{ item.time }}</h5>
              <template class="flex">
                <span class="item-lable mr-2">应考人数</span>
                <p class="m-auto" style="color: #31969a">{{ item.expectNumber }}人</p>
                <span class="item-lable ml-4 mr-2">实考人数</span>
                <p class="m-auto" style="color: red">{{ item.actualNumber }}人</p>
              </template>
            </div>
          </div>
          <!-- right -->
          <el-button type="primary" style="border-radius: 16px" @click="startToReviewExam">阅卷</el-button>
        </div>
      </div>
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
import { useExamStore } from "@/store";
const props = defineProps({
  renderName: String|Object,
});
const emits = defineEmits();
const examStore = useExamStore();
const auditList = reactive([]);
for (let index = 0; index < 20; index++) {
  auditList.push({
    title: "2022年第一季度前端测评",
    time: "开始时间：2022-10-24 09:00:00",
    expectNumber: 50,
    actualNumber: 46,
  });
}
const startToReviewExam = () => {
  emits("update:renderName", "ReviewList");
  examStore.$reset();
};
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
.audit-container {
  .audit-item {
    border-radius: 8px;
    .mark {
      transform: rotate(-45deg);
      font-size: 12px;
      color: rgb(244, 234, 234);
      z-index: 10;
      position: absolute;
      top: 4px;
    }
    .item-h5 {
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #666666;
    }
    .item-lable {
      font-family: "ArialMT", "Arial", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      letter-spacing: normal;
      color: #333333;
      vertical-align: none;
      text-align: center;
      line-height: normal;
      text-transform: none;
      background-color: #f0f0f0;
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
}
</style>
