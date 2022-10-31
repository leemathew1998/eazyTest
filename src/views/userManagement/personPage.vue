<template>
  <div class="flex flex-col">
    <div class="flex mt-4">
      <PersonInfo style="flex: 1"></PersonInfo>
      <Announcement class="ml-2" style="flex: 3"></Announcement>
    </div>
  </div>
</template>
<script setup>
import PersonInfo from "@/components/userManagement/personPage/personInfo.vue";
import Announcement from "@/components/userManagement/personPage/announcement.vue";
</script>
<style lang="less" scoped></style>
