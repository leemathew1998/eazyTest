import { ElMessage } from "element-plus";
import { hasAbnormal } from "@/api/examBankManagement.js";
import { useExamStore, useUserStore } from "@/store";
import dayjs from "dayjs";
import emiter from "@/utils/mitt.js";
const examStore = useExamStore();
const userStore = useUserStore();
const fullscreenchange = (e) => {
  if (document.fullscreenElement) {
    console.log("进入全屏");
  } else {
    console.log("退出全屏");
    //需要看考试时间是不是到了，如果到了那就不提交
    if (examStore.endTimestamp > dayjs().unix()) {
      examStore.abnormalList.push(`${dayjs().format("YYYY-MM-DD HH:mm:ss")}-退出全屏`);
      hasAbnormal({
        abnormal: examStore.abnormalList.join(","),
        userId: userStore.userId,
        examId: examStore.examId,
      });
      ElMessage.warning("退出全屏!请规范考试动作，相关异常行为已记录！");
      emiter.emit("exitFullScreen");
    }
  }
};
export const antiCheatingMethod = async () => {
  //增加水印
  __canvasWM({
    container: document.body,
    content: `${userStore.username}`,
  });
  //剪切板，由于不是https，所以不会触发
  // await window.navigator.clipboard.writeText(placeholderLogo);
  //防止浏览器后退按钮
  if (window.history && window.history.pushState) {
    window.onpopstate = function () {
      ElMessage.warning("考试过程中禁止操作无关按钮！");
      window.history.pushState("forward", null, "");
      window.history.forward(1);
    };
  }
  window.history.pushState("forward", null, ""); //在IE中必须得有这两行
  window.history.forward(1);
  window.onblur = onblur = function (e) {
    if (e.type == "blur") {
      examStore.abnormalList.push(`${dayjs().format("YYYY-MM-DD HH:mm:ss")}-页面切换`);
      hasAbnormal({
        abnormal: examStore.abnormalList.join(","),
        userId: userStore.userId,
        examId: examStore.examId,
      });
      ElMessage.warning("请规范考试动作，相关异常行为已记录！");
    }
    return;
  };
  document.addEventListener("fullscreenchange", fullscreenchange, false);
  window.onselectstart =
    document.onselectstart =
    document.body.onselectstart =
    document.querySelector("html").onselectstart =
      function () {
        return false;
      };
  window.oncopy =
    window.onpaste =
    document.oncopy =
    document.onpaste =
    document.body.oncopy =
    document.body.onpaste =
      function () {
        return false;
      };
  window.oncontextmenu =
    document.oncontextmenu =
    document.body.oncontextmenu =
    oncontextmenu =
    document.querySelector("html").oncontextmenu =
      function () {
        return false;
      };
  window.onkeydown = function (event) {
    var nKeyCode = event.keyCode || event.which || event.charCode;
    //获取ctrl 键对应的事件属性
    var bCtrlKeyCode = event.ctrlKey || event.metaKey;
    if (nKeyCode == 83 && bCtrlKeyCode) {
      return false;
    }
    if (nKeyCode == 91 && bCtrlKeyCode) {
      return false;
    }
  };
};

export const removeEventListeners = () => {
  document.removeEventListener("fullscreenchange", fullscreenchange);
  document.body.removeChild(document.getElementById("watermarkDiv"));
  window.onpopstate = function () {
    return true;
  };
  window.onblur = onblur = function (e) {
    return true;
  };
  window.onkeydown = function (event) {
    return true;
  };
  window.onselectstart =
    document.onselectstart =
    document.body.onselectstart =
    document.querySelector("html").onselectstart =
      function () {
        return true;
      };
  window.oncopy =
    window.onpaste =
    document.oncopy =
    document.onpaste =
    document.body.oncopy =
    document.body.onpaste =
      function () {
        return true;
      };
  window.oncontextmenu =
    document.oncontextmenu =
    document.body.oncontextmenu =
    oncontextmenu =
    document.querySelector("html").oncontextmenu =
      function () {
        return true;
      };
};

export const Fullscreen = async () => {
  var el = document.documentElement;
  // 兼容各个浏览器请求全屏方法
  (el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen).call(el);
};
export const exitFullscreen = () => {
  (
    document.exitFullscreen ||
    document.msExitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen
  ).call(document);
};

export const placeholderLogo = `
███╗   ██╗ █████╗ ██████╗ ██╗
████╗  ██║██╔══██╗██╔══██╗██║
██╔██╗ ██║███████║██████╔╝██║
██║╚██╗██║██╔══██║██╔══██╗██║
██║ ╚████║██║  ██║██║  ██║██║
╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝           
南瑞考试系统--Designed by nari
         `;

// 获取浏览器类型
export function getBrowserType() {
  // 获取浏览器 userAgent
  var ua = navigator.userAgent;

  // 是否为 Opera
  var isOpera = ua.indexOf("Opera") > -1;
  // 返回结果
  if (isOpera) {
    return "Opera";
  }

  // 是否为 IE
  var isIE = ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1 && !isOpera;
  var isIE11 = ua.indexOf("Trident") > -1 && ua.indexOf("rv:11.0") > -1;
  // 返回结果
  if (isIE11) {
    return "IE11";
  } else if (isIE) {
    // 检测是否匹配
    var re = new RegExp("MSIE (\\d+\\.\\d+);");
    re.test(ua);
    // 获取版本
    var ver = parseFloat(RegExp["$1"]);
    // 返回结果
    if (ver == 7) {
      return "IE7";
    } else if (ver == 8) {
      return "IE8";
    } else if (ver == 9) {
      return "IE9";
    } else if (ver == 10) {
      return "IE10";
    } else {
      return "IE";
    }
  }

  // 是否为 Edge
  var isEdge = ua.indexOf("Edge") > -1;
  // 返回结果
  if (isEdge) {
    return "Edge";
  }

  // 是否为 Firefox
  var isFirefox = ua.indexOf("Firefox") > -1;
  // 返回结果
  if (isFirefox) {
    return "Firefox";
  }

  // 是否为 Safari
  var isSafari = ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") == -1;
  // 返回结果
  if (isSafari) {
    return "Safari";
  }

  // 是否为 Chrome
  var isChrome = ua.indexOf("Chrome") > -1 && ua.indexOf("Safari") > -1 && ua.indexOf("Edge") == -1;
  // 返回结果
  if (isChrome) {
    return "Chrome";
  }

  // 是否为 UC
  var isUC = ua.indexOf("UBrowser") > -1;
  // 返回结果
  if (isUC) {
    return "UC";
  }

  // 是否为 QQ
  var isQQ = ua.indexOf("QQBrowser") > -1;
  // 返回结果
  if (isUC) {
    return "QQ";
  }

  // 都不是
  return "";
}

// canvas 实现 watermark
export const __canvasWM = ({
  // 使用 ES6 的函数默认值方式设置参数的默认取值
  // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
  container = document.body,
  width = "250px",
  height = "200px",
  textAlign = "center",
  textBaseline = "middle",
  font = "12px microsoft yahei",
  fillStyle = "rgba(184, 184, 184, 0.8)",
  content = "请勿外传",
  rotate = "30",
  zIndex = 1000,
} = {}) => {
  var canvas = document.createElement("canvas");

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  var ctx = canvas.getContext("2d");

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate((Math.PI / 180) * rotate);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  var base64Url = canvas.toDataURL();
  const watermarkDiv = document.createElement("div");
  watermarkDiv.setAttribute(
    "style",
    `
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      z-index:${zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-image:url('${base64Url}')`,
  );
  watermarkDiv.setAttribute("id", "watermarkDiv");
  container.style.position = "relative";
  container.insertBefore(watermarkDiv, container.firstChild);
};
