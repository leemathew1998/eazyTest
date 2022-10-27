<template>
  <div class="flex h-64">
    <div class="hand" @click="selectOneMethod('manualRender')">
      <span>手动出卷</span>
    </div>
    <div class="auto" @click="selectOneMethod('AutoRender')">
      <span>自动出卷</span>
    </div>
  </div>
</template>
<script setup>
const emits = defineEmits();
/*
 *@Author: jkwei
 *@Date: 2022-10-27 13:41:41
 *@Description: 
 This is your last chance. 
 After this, there is no turning back. 
 You take the blue pill – the story ends,
 you wake up in your bed and believe whatever you want to believe.
 You take the red pill – you stay in Wonderland
*/
const selectOneMethod = (name) => {
  emits("changeRenderComponent", name);
};
</script>
<style lang="less" scoped>
.hand,
.auto {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 12px;
  margin: 2rem;
  cursor: pointer;
  font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #fbfbfb;
}
.hand {
  background-color: rgba(68, 215, 182, 1);
}
.auto {
  background-color: rgba(0, 145, 255, 1);
}
</style>
