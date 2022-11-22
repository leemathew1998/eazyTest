export const questions = [];
export const questionsForReview = []
for (let index = 0; index < 20; index++) {
	questions.push({
		type: "单选",
		count: index + 1,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
}

for (let index = 20; index < 40; index++) {
	questions.push({
		type: "多选",
		count: index + 1,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
}
for (let index = 40; index < 60; index++) {
	questions.push({
		type: "判断",
		count: index + 1,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
}
for (let index = 60; index < 80; index++) {
	questionsForReview.push({
		type: "简答",
		count: index -59,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
	questions.push({
		type: "简答",
		count: index + 1,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
}

for (let index = 80; index < 100; index++) {
	questions.push({
		type: "编程",
		count: index + 1,
		content: "下列哪一项属性不属于字体<font>标记属性。",
	});
}



export const indexMapToTitle = ["单选", "多选", "判断", "简答", "编程"];

export const initState = {
	单选: [],
	多选: [],
	判断: [],
	简答: [],
	编程: [],
};

export const config = {
	iceServers: [{
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
export const offerOptions = {
	offerToReceiveVideo: 1,
	offerToReceiveAudio: 1,
};
