<template>
  <div class="h-screen w-full bg-red-500 flex justify-center item-center">
    123456
    <div class="ring-4">ssbhs</div>

    <!-- <AliPlayerV3
      source="http://192.168.3.10:7001/http/flv.flv"
      ref="AliPlayerV3"
      :options="options"
    /> -->
  </div>
</template>

<script setup>
// rtmp://192.168.3.10:1935/live/test
import { ref, reactive } from "vue";
//
const options = reactive({
  isLive: true, //切换为直播流的时候必填
  autoplay: true,
});
</script>

<style scoped lang="less">
</style>
