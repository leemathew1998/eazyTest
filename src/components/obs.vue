<template>
  <div class="video">
    123456

    <AliPlayerV3
      source="http://192.168.3.10:7001/http/flv.flv"
      ref="AliPlayerV3"
      :options="options"
    />
  </div>
</template>

<script setup>
// rtmp://192.168.3.10:1935/live/test
import { ref, reactive } from "vue";
import { AliPlayerV3 } from "vue-aliplayer-v3";
console.log(AliPlayerV3);
// 
const options = reactive({
  isLive: true, //切换为直播流的时候必填
  autoplay:true
});
</script>

<style scoped lang="less">
.video {
  width: 100%;
  height: 50%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
