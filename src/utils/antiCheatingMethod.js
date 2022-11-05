export const antiCheatingMethod = async () => {
  await window.navigator.clipboard.writeText(placeholderLogo);
  window.onblur = onblur = function (e) {
    e.type == "blur" ? alert("异常！！！") : "";
    return;
  };
  document.addEventListener("fullscreenchange", function (e) {
    if (document.fullscreenElement) {
      console.log("进入全屏");
    } else {
      alert("退出全屏");
    }
  });
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
  document.removeEventListener("fullscreenchange", (e) => {
    console.log("关闭了监听");
  });
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
