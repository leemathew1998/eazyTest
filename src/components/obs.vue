<template>
  <div class="video">
    <video id="videoElement"></video>
  </div>
</template>

<script setup>
import flvjs from 'flv.js/dist/flv.js';
// rtmp://192.168.3.10:1935/live/test
import {ref,reactive} from 'vue'
if(flvjs.isSupported()){
    var videoElement = document.getElementById('videoElement');
    var flvPlayer = flvjs.createPlayer({
        type: 'video/rtmp',
        "isLive": true,
        url: 'rtmp://192.168.3.10:1935/live/test'
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
}
</script>

<style scoped lang="less">
.video {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
