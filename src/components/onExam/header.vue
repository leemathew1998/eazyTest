<template>
  <BlankCardVue>
    <template #mainContent>
      <div class="flex justify-between items-center">
        <span class="title">2022年10月前端技术考试一</span>
        <el-button>
          <img src="@/assets/image/u3164.svg" class="pr-2" />退出
        </el-button>
      </div>
    </template>
  </BlankCardVue>
</template>
<script setup>
import BlankCardVue from "@/components/blankCard.vue";
</script>
<style lang="less" scoped>
.title {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #31969a;
}
:deep(.el-button) {
  border-width: 0px;
  display: flex;
  font-family: "思源黑体 CN Normal", "思源黑体 CN Regular", "思源黑体 CN",
    sans-serif;
  font-weight: 350;
  font-style: normal;
  font-size: 14px;
  color: #333333;
  background-color: rgba(0, 121, 106, 0);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(217, 217, 217, 1);
  border-radius: 6px;
  padding: 0 1.5em;
}
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1);
  color: #fff;
}
</style>
