import { ElMessage } from "element-plus";

const fullscreenchange = (e) => {
  if (document.fullscreenElement) {
    console.log("进入全屏");
  } else {
    ElMessage.warning("退出全屏!请规范考试动作，相关异常行为已记录！");
  }
};
export const antiCheatingMethod = async () => {
  await window.navigator.clipboard.writeText(placeholderLogo);
  window.onblur = onblur = function (e) {
    if (e.type == "blur") {
      ElMessage.warning("请规范考试动作，相关异常行为已记录！");
    }
    return;
  };
  document.addEventListener("fullscreenchange");
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
  //禁止F12键盘
  window.onkeydown =
    window.onkeyup =
    window.onkeypress =
      function (event) {
        if (event.keyCode == 123) {
          event.preventDefault();
          window.event.returnValue = false;
        }
      };

  //禁用backspace键
  document.onkeydown = function (e) {
    var e = e || window.event;
    var key = e.keyCode || e.which;
    var srcEle = e.srcElement ? e.srcElement : e.target;
    //禁用   Alt+   方向键   →和禁用   Alt+   方向键   ←
    if (e.altKey && (key == 37 || key == 39)) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用退格删除键   ，   F5   刷新键，Ctrl   +   R
    if (key == 116 || (e.ctrlKey && key == 82)) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用   Ctrl+n
    if (e.ctrlKey && key == 78) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用   shift
    if (e.shiftKey) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用：ctrl
    if (e.ctrlKey) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用   shift+F10
    if (e.shiftKey && key == 121) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用：ctrl+F10
    if (e.ctrlKey && key == 121) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用   shift   加鼠标左键新开一网页
    if (srcEle.tagName == "A" && e.shiftKey) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        event.keyCode = 0;
        e.returnValue = false;
      }
    }
    //禁用Alt+F4
    if (e.altKey && key == 115) {
      window.showModelessDialog("about:blank ", " ", "dialogWidth:1px;dialogheight:1px ");
      return false;
    }
  };
};

export const removeEventListeners = () => {
  document.removeEventListener("fullscreenchange", fullscreenchange);
  window.onblur = onblur = function (e) {
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
        return false;
      };
  window.oncontextmenu =
    document.oncontextmenu =
    document.body.oncontextmenu =
    oncontextmenu =
    document.querySelector("html").oncontextmenu =
      function () {
        return true;
      };
  //禁止F12键盘
  window.onkeydown =
    window.onkeyup =
    window.onkeypress =
      function (event) {
        return true;
      };

  //禁用backspace键
  document.onkeydown = function (e) {
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
