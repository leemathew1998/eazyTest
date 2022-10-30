<template>
  <div class="h-screen w-full">
    <div class="top-windows"></div>
    <div class="bottom-message"></div>
    <div id="videoContainer" class="video-container" align="center"></div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from "vue";
// 初始化所需要的数据
let userName = JSON.stringify(Math.random());
let roomName = "examOne";
let videoContainer;
let ws;
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
onMounted(()=>{
  videoContainer = document.getElementById("videoContainer"); // 通话列表
  initConnect()
})
// 复杂函数开始初始化
const initConnect = () => {
  ws = new WebSocket(`wss://192.168.3.10:8103`);
  ws.onopen = (evt) => {
    console.log("connent WebSocket is ok");
    const sendJson = JSON.stringify({
      type: "conn",
      // 用户名随机
      userName: userName,
    });
    ws.send(sendJson); // 注册用户名
  };
  ws.onmessage = (msg) => {
    const str = msg.data.toString();
    const json = JSON.parse(str);
    if (json.type === "conn") {
      console.log("连接成功");
      joinGroup(roomName);
    } else if (json.type === "room") {
      console.log("返回房间内所有用户", json);
      sendRoomUser(json.roomUserList, 0);
    } else if (json.type === "signalOffer") {
      console.log("收到信令Offer", json);
      signalOffer(json);
    } else if (json.type === "signalAnswer") {
      console.log("收到信令Answer", json);
      signalAnswer(json);
    } else if (json.type === "iceOffer") {
      console.log("收到iceOffer", json);
      addIceCandidates(json);
    } else if (json.type === "close") {
      console.log("收到房间内用户离开", json);
      closeRoomUser(json);
    }
  };
};
// 加入群组
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
  addUserItem(userName, localStream.id, localStream);
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
// 移除用户
const removeUserItem = (streamId) => {
  videoContainer.removeChild(document.getElementById(streamId + "_item"));
};
// 房间内用户离开
const closeRoomUser = (json) => {
  const { sourceName, streamId } = json;
  const index = pcList.findIndex((i) => i.userName === sourceName);
  if (index > -1) {
    pcList.splice(index, 1);
  }
  removeUserItem(streamId);
};
// 接收ice并添加
const addIceCandidates = (json) => {
  const { iceCandidate, sourceName } = json;
  const item = pcList.find((i) => i.userName === sourceName);
  if (item) {
    const { pc } = item;
    pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
  }
};
// 接收 Answer 请求信令
const signalAnswer=(json) =>{
  const { answer, sourceName, streamId } = json;
  addUserItem(sourceName, streamId);
  const item = pcList.find((i) => i.userName === sourceName);
  if (item) {
    const { pc } = item;
    pc.setRemoteDescription(new RTCSessionDescription(answer)); // 设置远端描述
    // 监听远端视频流
    pc.addEventListener("addstream", function (event) {
      console.log(
        "进入了危险代码，此处需要以后注意！如果打印了，需要进入此处调整！"
      );
      // document.getElementById(event.stream.id).srcObject = event.stream;
    });
  }
}
// 接收 Offer 请求信令
const signalOffer=(json) =>{
  const { offer, sourceName, streamId } = json;
  addUserItem(sourceName, streamId);
  const pc = createWebRTC(sourceName);
  pc.setRemoteDescription(new RTCSessionDescription(offer)); // 设置远端描述
  // 创建 Answer 请求
  pc.createAnswer().then(function (answer) {
    pc.setLocalDescription(answer); // 设置本地 Answer 描述
    const str = JSON.stringify({
      type: "signalAnswer",
      answer,
      userName: sourceName,
    });
    ws.send(str); // 发送 Answer 请求信令
  });
  // 监听远端视频流
  pc.addEventListener("addstream", function (event) {
    console.log(
      "进入了危险代码，此处需要以后注意！如果打印了，需要进入此处调整！"
    );
    // document.getElementById(event.stream.id).srcObject = event.stream; // 播放远端视频流
  });
  // 监听 ice
  pc.addEventListener("icecandidate", function (event) {
    const iceCandidate = event.candidate;
    if (iceCandidate) {
      // 发送 iceOffer 请求
      const str = JSON.stringify({
        type: "iceOffer",
        iceCandidate,
        userName: sourceName,
      });
      ws.send(str);
    }
  });
}
// 创建WebRTC
const createWebRTC = (userName, isOffer) => {
  const pc = new RTCPeerConnection(config); // 创建 RTC 连接
  pcList.push({
    userName,
    pc,
  });
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream)); // 添加本地视频流 track
  if (isOffer) {
    // 创建 Offer 请求
    pc.createOffer(offerOptions).then(function (offer) {
      pc.setLocalDescription(offer); // 设置本地 Offer 描述，（设置描述之后会触发ice事件）
      const str = JSON.stringify({
        type: "signalOffer",
        offer,
        userName,
      });
      ws.send(str); // 发送 Offer 请求信令
    });
    // 监听 ice
    pc.addEventListener("icecandidate", function (event) {
      const iceCandidate = event.candidate;
      if (iceCandidate) {
        // 发送 iceOffer 请求
        const str = JSON.stringify({
          type: "iceOffer",
          iceCandidate,
          userName,
        });
        ws.send(str);
      }
    });
  }
  return pc;
};
// 发送group用户
const sendRoomUser = (list, index) => {
  createWebRTC(list[index], true);
  index++;
  if (list.length > index) {
    sendRoomUser(list, index);
  }
};
</script>

<style scoped lang="less">

</style>
