<template>
  <div class="h-screen w-full">
    <div id="videoContainer" class="video-container" align="center"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
// 初始化所需要的数据
let userName = JSON.stringify(Math.random());
let roomName = "examOne";
let videoContainer;
var ws;
let pcList = [];
let localStream;
const config = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302?transport=udp",
      ],
    },
    {
      urls: "turn:xxx.com:3478", // 跨网段需要部署 turn 服务器
      credential: "xxx",
      username: "xxx",
    },
  ],
};
const offerOptions = {
  offerToReceiveVideo: 1,
  offerToReceiveAudio: 1,
};
// 开始定义函数。。。
const init = async () => {
  await initConnect();
  // setTimeout(()=>{
  //   joinGroup()
  // },1000)
};
init();
// 复杂函数

const initConnect = () => {
  // ws = new WebSocket(`wss://192.168.3.10:8103`);
  // console.log(ws);
  // ws.onopen = (evt) => {
  //   console.log("connent WebSocket is ok");
  //   const sendJson = JSON.stringify({
  //     type: "conn",
  //     // 用户名随机
  //     userName: userName,
  //   });
  //   ws.send(sendJson); // 注册用户名
  // };
  // ws.onmessage = (msg) => {
  //   console.log(msg);
  //   const str = msg.data.toString();
  //   const json = JSON.parse(str);
  //   if (json.type === "conn") {
  //     console.log("连接成功");
  //     joinGroup(roomName);
  //   } else if (json.type === "room") {
  //     console.log("返回房间内所有用户", json);
  //     sendRoomUser(json.roomUserList, 0);
  //   } else if (json.type === "signalOffer") {
  //     console.log("收到信令Offer", json);
  //     signalOffer(json);
  //   } else if (json.type === "signalAnswer") {
  //     console.log("收到信令Answer", json);
  //     signalAnswer(json);
  //   } else if (json.type === "iceOffer") {
  //     console.log("收到iceOffer", json);
  //     addIceCandidates(json);
  //   } else if (json.type === "close") {
  //     console.log("收到房间内用户离开", json);
  //     closeRoomUser(json);
  //   }
  // };
};
const joinGroup = async () => {
  console.log("调取摄像头");
  const userConstraints = {
    video: true,
    audio: {
      noiseSuppression: true,
      echoCancellation: true,
    },
  };
  const mediastream = await navigator.mediaDevices.getUserMedia(
    userConstraints
  );
  localStream = mediastream;
  addUserItem(userNameLocal.value, localStream.id, localStream);
  const str = JSON.stringify({
    type: "room",
    roomName: roomName,
    streamId: mediastream.id,
  });
  ws.send(str);
};
// 添加用户
const addUserItem = (userName, mediaStreamId, src) => {
  const div = document.createElement("div");
  div.id = mediaStreamId + "_item";
  div.className = "video-item";
  const span = document.createElement("span");
  span.className = "video-title";
  span.innerHTML = userName;
  div.appendChild(span);
  const video = document.createElement("video");
  video.id = mediaStreamId;
  video.className = "video-play";
  video.controls = true;
  video.autoplay = true;
  video.muted = true;
  video.webkitPlaysinline = true;
  src && (video.srcObject = src);
  div.appendChild(video);
  videoContainer.appendChild(div);
};
</script>

<style scoped lang="less"></style>
