<template>
  <div class="video">123456</div>
</template>

<script setup>
// rtmp://192.168.3.10:1935/live/test
import { ref, reactive } from "vue";
import { AliPlayerV3 } from "vue-aliplayer-v3";
console.log(AliPlayerV3);
</script>

<style scoped lang="less">
.video {
  width: 100%;
  height: 50%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
