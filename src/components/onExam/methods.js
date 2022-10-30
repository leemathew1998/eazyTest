import { computed, ref } from "vue";
import { useExamStore, useUserStore } from "@/store";
import { config, offerOptions } from "./constants.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
const examStore = useExamStore();

//完成题目个数百分比相关
export let allCount = 1; //防止无穷小
export const finishedCount = computed(() => {
  const temp = Object.values(examStore.answers).flat();
  allCount = temp.length;
  return temp.filter((item) => {
    return item.answer.length !== 0;
  }).length;
});

//倒计时模块,需要后期修改，定时获取正确的时间，这个可能不准！
let totalSeconds = examStore.totalExamTime * 60; //总考试秒数
let startTimeStampForCountdownModule = null;
let timer = null;
export const renderTimeFormat = ref("00:00:00");
const countdownFn = () => {
  if (totalSeconds > 0) {
    const endTime = new Date().valueOf();
    if (endTime - startTimeStampForCountdownModule > 1000) {
      startTimeStampForCountdownModule = endTime;
      totalSeconds--;
      renderTimeFormat.value = timeFormat(totalSeconds);
    }
    requestAnimationFrame(countdownFn);
  } else {
    // 考试时间已经结束！弹出对话框！
    examFinished();
    cancelAnimationFrame(timer);
  }
};
const examFinished = () => {
  console.log("考试结束！");
};
const timeFormat = (seconds) => {
  return dayjs.duration(seconds * 1000).format("HH:mm:ss");
};
startTimeStampForCountdownModule = new Date().valueOf();
timer = requestAnimationFrame(countdownFn);

// RTC相关----------------------------------------------
let ws;
let pcList = [];
let localStream;
let roomName = "examOne"; //测试环境
const userStore = useUserStore();
export const initConnect = () => {
  ws = new WebSocket(`wss://192.168.3.10:8103`);
  ws.onopen = (evt) => {
    console.log("connent WebSocket is ok,this user name is ", userStore.username);
    const sendJson = JSON.stringify({
      type: "conn",
      // 用户名随机
      userName: userStore.username,
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
export const getAllUser = () => {
  console.log("getAllUser");
  const str = JSON.stringify({
    type: "room",
    roomName: roomName,
    // streamId: mediastream.id,
  });
  ws.send(str);
};

export const joinGroup = async () => {
  console.log("调取摄像头");
  const userConstraints = {
    video: true,
    audio: {
      noiseSuppression: true,
      echoCancellation: true,
    },
  };
  let mediastream;
  try {
    mediastream = await navigator.mediaDevices.getUserMedia(userConstraints);
  } catch (error) {
    mediastream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }
  localStream = mediastream;
  // addUserItem(userName, localStream.id, localStream);
  const str = JSON.stringify({
    type: "room",
    roomName: roomName,
    streamId: mediastream.id,
  });
  ws.send(str);
};

// 添加用户
const addUserItem = (userName, mediaStreamId, src) => {
  console.log("addUserItem-->", userName);
};
// 移除用户
const removeUserItem = (streamId) => {
  console.log("removeUserItem-->", streamId);
};
// 房间内用户离开
const closeRoomUser = (json) => {
  console.log("closeRoomUser-->", json);
  const { sourceName, streamId } = json;
  const index = pcList.findIndex((i) => i.userName === sourceName);
  if (index > -1) {
    pcList.splice(index, 1);
  }
  removeUserItem(streamId);
};
// 接收ice并添加
const addIceCandidates = (json) => {
  console.log("addIceCandidates-->", json);
  const { iceCandidate, sourceName } = json;
  const item = pcList.find((i) => i.userName === sourceName);
  if (item) {
    const { pc } = item;
    pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
  }
};
// 接收 Answer 请求信令
const signalAnswer = (json) => {
  const { answer, sourceName, streamId } = json;
  addUserItem(sourceName, streamId);
  const item = pcList.find((i) => i.userName === sourceName);
  // if (item) {
  //   const { pc } = item;
  //   pc.setRemoteDescription(new RTCSessionDescription(answer)); // 设置远端描述
  //   // 监听远端视频流
  //   pc.addEventListener("addstream", function (event) {
  //     console.log("进入了赋值代码，signalAnswer方法", event.stream);
  //     // document.getElementById(event.stream.id).srcObject = event.stream;
  //   });
  // }
};
// 接收 Offer 请求信令
const signalOffer = (json) => {
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
    console.log("进入了赋值代码，signalOffer方法,-----------------", event.stream, sourceName);
    examStore.MediaStreamList.push({
      username: sourceName,
      MediaStream: event.stream,
    });
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
// 发送group用户
const sendRoomUser = (list, index) => {
  createWebRTC(list[index], true);
  index++;
  if (list.length > index) {
    sendRoomUser(list, index);
  }
};
