<template>
  <div class="flex flex-col h-full">
    <div class="flex mt-4 mb-2">
      <PersonInfo style="flex: 1"></PersonInfo>
      <Announcement class="ml-2" style="flex: 3"></Announcement>
    </div>
    <div class="h-full">
      <OnLineList></OnLineList>
    </div>
  </div>
</template>
<script setup>
import PersonInfo from "@/components/userManagement/personPage/personInfo.vue";
import Announcement from "@/components/userManagement/personPage/announcement.vue";
import OnLineList from "@/components/userManagement/personPage/onLineList.vue";
</script>
<style lang="less" scoped></style>
