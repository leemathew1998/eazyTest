import { ref, reactive } from "vue";
let ws = ref(null);
let userNameLocal = ref("");
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




const sendRoomUser = (list, index) => {
  createWebRTC(list[index], true);
  index++;
  if (list.length > index) {
    sendRoomUser(list, index);
  }
};
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
// 接收 Offer 请求信令
function signalOffer(json) {
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
    document.getElementById(event.stream.id).srcObject = event.stream; // 播放远端视频流
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
// 接收 Answer 请求信令
function signalAnswer(json) {
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
      document.getElementById(event.stream.id).srcObject = event.stream;
    });
  }
}
// 接收ice并添加
function addIceCandidates(json) {
  const { iceCandidate, sourceName } = json;
  const item = pcList.find((i) => i.userName === sourceName);
  if (item) {
    const { pc } = item;
    pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
  }
}
// 房间内用户离开
function closeRoomUser(json) {
  const { sourceName, streamId } = json;
  const index = pcList.findIndex((i) => i.userName === sourceName);
  if (index > -1) {
    pcList.splice(index, 1);
  }
  removeUserItem(streamId);
}
// 添加用户
function addUserItem(userName, mediaStreamId, src) {
  console.log("添加用户！！！");
}
// 移除用户
function removeUserItem(streamId) {
  console.log("移除用户!!!");
}
export { initConnect, joinGroup };
