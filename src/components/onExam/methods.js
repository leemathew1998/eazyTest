import { computed, ref, watch } from "vue";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import kurentoUtils from "kurento-utils";
dayjs.extend(duration);
const examStore = useExamStore();
const userStore = useUserStore();

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

// 代码运行阶段
export const codeResult = ref("");
export const runTime = ref(0);
export const runCode = () => {
  const startTime = new Date().valueOf();
  const userCode = examStore.answers["编程"][examStore.runCodeIndex].answer;
  let runTimeCode = `${userCode}
 return addTwoNumber(twoSum);`;
  //获取测试用例，并开始执行
  let twoSum = [1, 2];
  let fn = new Function("twoSum", runTimeCode);
  let result;
  try {
    result = fn(twoSum);
    if (result === 3) {
      codeResult.value = "测试通过！";
      console.log("Output=>3, 与测试案例一致，代码运行成功");
    } else {
      codeResult.value = "测试未通过！";
      //结果不一致
      console.log(`结果不一致,${result}`);
    }
  } catch (e) {
    codeResult.value = e;
    result = e;
    //代码错误
    console.log(`代码错误,${result}`);
  }
  runTime.value = new Date().valueOf() - startTime;
  examStore.runCodeIndex = -1;
};

// RTC相关----------------------------------------------
var ws = new WebSocket("wss://localhost:8443/one2one");
var videoInput;
var videoOutput;
var webRtcPeer;

var registerName = null;
const NOT_REGISTERED = 0;
const REGISTERING = 1;
const REGISTERED = 2;
var registerState = null;

function setRegisterState(nextState) {
  switch (nextState) {
    case NOT_REGISTERED:
      break;

    case REGISTERING:
      break;

    case REGISTERED:
      setCallState(NO_CALL);
      break;

    default:
      return;
  }
  registerState = nextState;
}

const NO_CALL = 0;
const PROCESSING_CALL = 1;
const IN_CALL = 2;
var callState = null;

function setCallState(nextState) {
  switch (nextState) {
    case NO_CALL:
      break;

    case PROCESSING_CALL:
      break;
    case IN_CALL:
      break;
    default:
      return;
  }
  callState = nextState;
}

window.onload = function () {
  console = new Console();
  setRegisterState(NOT_REGISTERED);
  videoInput = document.getElementById("videoInput");
  videoOutput = document.getElementById("videoOutput");
  document.getElementById("name").focus();

  document.getElementById("register").addEventListener("click", function () {
    register();
  });
  document.getElementById("call").addEventListener("click", function () {
    call();
  });
  document.getElementById("terminate").addEventListener("click", function () {
    stop();
  });
};

window.onbeforeunload = function () {
  ws.close();
};

ws.onmessage = function (message) {
  var parsedMessage = JSON.parse(message.data);
  console.info("Received message: " + message.data);

  switch (parsedMessage.id) {
    case "registerResponse":
      resgisterResponse(parsedMessage);
      break;
    case "callResponse":
      callResponse(parsedMessage);
      break;
    case "incomingCall":
      incomingCall(parsedMessage);
      break;
    case "startCommunication":
      startCommunication(parsedMessage);
      break;
    case "stopCommunication":
      console.info("Communication ended by remote peer");
      stop(true);
      break;
    case "iceCandidate":
      webRtcPeer.addIceCandidate(parsedMessage.candidate);
      break;
    default:
      console.error("Unrecognized message", parsedMessage);
  }
};

function resgisterResponse(message) {
  if (message.response == "accepted") {
    setRegisterState(REGISTERED);
  } else {
    setRegisterState(NOT_REGISTERED);
    var errorMessage = message.message ? message.message : "Unknown reason for register rejection.";
    console.log(errorMessage);
    alert("Error registering user. See console for further information.");
  }
}

function callResponse(message) {
  if (message.response != "accepted") {
    console.info("Call not accepted by peer. Closing call");
    var errorMessage = message.message ? message.message : "Unknown reason for call rejection.";
    console.log(errorMessage);
    stop(true);
  } else {
    setCallState(IN_CALL);
    webRtcPeer.processAnswer(message.sdpAnswer);
  }
}

function startCommunication(message) {
  setCallState(IN_CALL);
  webRtcPeer.processAnswer(message.sdpAnswer);
}

function incomingCall(message) {
  // If bussy just reject without disturbing user
  if (callState != NO_CALL) {
    var response = {
      id: "incomingCallResponse",
      from: message.from,
      callResponse: "reject",
      message: "bussy",
    };
    return sendMessage(response);
  }

  setCallState(PROCESSING_CALL);
  showSpinner(videoInput, videoOutput);

  var options = {
    localVideo: videoInput,
    remoteVideo: videoOutput,
    onicecandidate: onIceCandidate,
  };
  console.log("kurentoUtils", kurentoUtils);
  webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (error) {
    if (error) {
      console.error(error);
      setCallState(NO_CALL);
    }

    this.generateOffer(function (error, offerSdp) {
      if (error) {
        console.error(error);
        setCallState(NO_CALL);
      }
      var response = {
        id: "incomingCallResponse",
        from: message.from,
        callResponse: "accept",
        sdpOffer: offerSdp,
      };
      sendMessage(response);
    });
  });
}
let user = 'wjkUser';
let manage = 'wjkMaster';
export function register(name) {
  setRegisterState(REGISTERING);

  var message = {
    id: "register",
    name: name === "user" ? user : manage,
  };
  sendMessage(message);
}

export function call() {
  setCallState(PROCESSING_CALL);

  showSpinner(videoInput, videoOutput);

  var options = {
    localVideo: videoInput,
    remoteVideo: videoOutput,
    onicecandidate: onIceCandidate,
  };
  var message = {
    id: "call",
    from: user,
    to: manage,
    sdpOffer: offerSdp,
  };
  sendMessage(message);
  // webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (error) {
  //   if (error) {
  //     console.error(error);
  //     setCallState(NO_CALL);
  //   }

  //   this.generateOffer(function (error, offerSdp) {
  //     if (error) {
  //       console.error(error);
  //       setCallState(NO_CALL);
  //     }
  //     var message = {
  //       id: "call",
  //       from: user,
  //       to: manage,
  //       sdpOffer: offerSdp,
  //     };
  //     sendMessage(message);
  //   });
  // });
}

function stop(message) {
  setCallState(NO_CALL);
  if (webRtcPeer) {
    webRtcPeer.dispose();
    webRtcPeer = null;

    if (!message) {
      var message = {
        id: "stop",
      };
      sendMessage(message);
    }
  }
}

function sendMessage(message) {
  var jsonMessage = JSON.stringify(message);
  console.log("Sending message: " + jsonMessage);
  console.log(ws)
  ws.send(jsonMessage);
}

function onIceCandidate(candidate) {
  console.log("Local candidate" + JSON.stringify(candidate));

  var message = {
    id: "onIceCandidate",
    candidate: candidate,
  };
  sendMessage(message);
}

function showSpinner() {}

function hideSpinner() {}
