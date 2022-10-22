export const antiCheatingMethod = async () => {
	await window.navigator.clipboard.writeText(`
	███╗   ██╗ █████╗ ██████╗ ██╗
	████╗  ██║██╔══██╗██╔══██╗██║
	██╔██╗ ██║███████║██████╔╝██║
	██║╚██╗██║██╔══██║██╔══██╗██║
	██║ ╚████║██║  ██║██║  ██║██║
	╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
								 
	南瑞考试系统--Designed by nari
			 `)
	window.onmouseleave = window.onblur = window.onmouseout = document.onmouseleave = document.onblur = document
		.onmouseout = document.body.onmouseleave = document.body.onblur = document.body.onmouseout = onmouseleave =
		onblur = onmouseout = function(e) {
			e.type=="blur"?alert('异常！！！'):''
			console.log(e.type)
		};
	document.addEventListener("fullscreenchange", function (e) {
		 if (document.fullscreenElement) {
		  console.log('进入全屏')
		 } else {
		 alert('退出全屏')
		 }
	})
	window.onselectstart = document.onselectstart = document.body.onselectstart = document
		.querySelector("html").onselectstart = function() {
			return false
		};
	window.oncopy = window.onpaste = document.oncopy = document.onpaste = document.body.oncopy = document.body
		.onpaste  = function() {
			return false
		};
	window.oncontextmenu = document.oncontextmenu = document.body.oncontextmenu = oncontextmenu = document
		.querySelector("html").oncontextmenu = function() {
			return false
		};
	//禁止F12键盘
	window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
		if (event.keyCode == 123) {
			event.preventDefault();
			window.event.returnValue = false;
		}
	}

        //禁用backspace键
        document.onkeydown = function (e) {
            var e = e || window.event;
            var key = e.keyCode || e.which;
            var srcEle = e.srcElement ? e.srcElement : e.target;
            //禁用   Alt+   方向键   →和禁用   Alt+   方向键   ←
            if ((e.altKey) && ((key == 37) || (key == 39))) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    event.keyCode = 0;
                    e.returnValue = false;
                }
            }
            //禁用退格删除键   ，   F5   刷新键，Ctrl   +   R
            if ((key == 116) || (e.ctrlKey && key == 82)) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    event.keyCode = 0;
                    e.returnValue = false;
                }
            }
            //禁用   Ctrl+n
            if ((e.ctrlKey) && (key == 78)) {
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
            if ((e.shiftKey) && (key == 121)) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    event.keyCode = 0;
                    e.returnValue = false;
                }
            }
            //禁用：ctrl+F10
            if ((e.ctrlKey) && (key == 121)) {
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
            if ((e.altKey) && (key == 115)) {
                window.showModelessDialog("about:blank ", " ", "dialogWidth:1px;dialogheight:1px ");
                return false;
            }
        }
	// document.onkeydown = function(evt)
	// 	{ 
	// 		console.log(evt)
	// 	  evt = evt||window.event;
	// 	  if (evt.keyCode==27){
	// 		  // evt.keyCode=0; 
	// 		  evt.preventDefault();
	// 		  // evt.returnValue=false;
	// 		  }  //屏蔽ESC
	// 	  if (evt.keyCode==114){evt.keyCode=0;evt.returnValue=false;}  //屏蔽F3
	// 	  if (evt.keyCode==116){evt.keyCode=0;evt.returnValue=false;}  //屏蔽F5
	// 	  if (evt.keyCode==122){evt.keyCode=0;evt.returnValue=false;}  //屏蔽F11
	// 	  if (evt.keyCode==123){evt.keyCode=0;evt.returnValue=false;}  //屏蔽F12
	// 	  if(evt.ctrlKey && evt.keyCode==67) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+c
	// 	  if(evt.ctrlKey && evt.keyCode==86) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+v
	// 	  if(evt.ctrlKey && evt.keyCode==70) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+f
	// 	  if(evt.ctrlKey && evt.keyCode==87) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+w
	// 	  if(evt.ctrlKey && evt.keyCode==69) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+e
	// 	  if(evt.ctrlKey && evt.keyCode==72) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+h
	// 	  if(evt.ctrlKey && evt.keyCode==73) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+i
	// 	  if(evt.ctrlKey && evt.keyCode==79) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+o
	// 	  if(evt.ctrlKey && evt.keyCode==76) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+l
	// 	  if(evt.ctrlKey && evt.keyCode==80) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+p
	// 	  if(evt.ctrlKey && evt.keyCode==66) {evt.keyCode=0;evt.returnValue=false;}	//屏蔽 Ctrl+b
	// 	  if (evt.ctrlKey && evt.keyCode==78) {evt.keyCode=0;evt.returnValue=false;}  //屏蔽 Ctrl+n
	// 	  if (evt.shiftKey && evt.keyCode==121){evt.keyCode=0;evt.returnValue=false;}  //屏蔽 shift+F10 
	// 	  if (evt.srcElement.tagName == "A" && window.evt.shiftKey) {evt.keyCode=0;evt.returnValue=false;}             //屏蔽 shift 加鼠标左键新开一网页 
	// 	}
}


export const Fullscreen = async () => {
	await antiCheatingMethod()
	var el = document.documentElement;
	// 兼容各个浏览器请求全屏方法
	(el.requestFullscreen ||
		el.webkitRequestFullScreen ||
		el.mozRequestFullScreen ||
		el.msRequestFullscreen).call(el);
}
export const exitFullscreen = () => {
	(document.exitFullscreen ||
		document.msExitFullscreen ||
		document.mozCancelFullScreen ||
		document.webkitExitFullscreen).call(document);
}