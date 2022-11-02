<template>
  <BlankCard>
    <template #mainContent>
      <div class="flex flex-col justify-between h-full">
        <div class="flex items-center">
          <img class="userImage" src="@/assets/image/user-search.svg" alt="" />
          <div class="flex flex-col justify-between">
            <span class="userName">刘莫言</span>
            <div>
              <span class="class">应用组</span>
              <span class="code">1234567890</span>
            </div>
          </div>
        </div>
        <!-- bottom -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex flex-col">
            <span class="title">最近考试分数</span>
            <span>98<span class="title" style="font-size: 12px">分</span></span>
          </div>
          <div class="flex flex-col">
            <span class="title">目前排名</span>
            <span>第1名</span>
          </div>
        </div>
      </div>
    </template>
  </BlankCard>
</template>
<script setup>
import BlankCard from "@/components/blankCardHFull.vue";
</script>
<style lang="less" scoped>
.userImage {
  background-color: rgba(118, 206, 195, 1);
  border-radius: 4px;
  width: 3.5rem;
  padding: 4px;
  margin-right: 1rem;
}
.userName {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  color: #333333;
  text-align: left;
}
.class {
  color: #fff;
  background-color: rgba(0, 145, 255, 1);
  border: none;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 30px;
}
.code {
  margin-left: 2rem;
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #666666;
  font-size: 14px;
}
.title {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #666666;
  font-size: 14px;
}
</style>
