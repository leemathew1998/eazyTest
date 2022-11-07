export const modalRules = {
	username: [{
		required: true,
		message: "请输入用户名",
		trigger: "blur"
	}],
	password: [{
		required: true,
		message: "请输入密码",
		trigger: "change",
	}, ],
	createdBy: [{
		required: true,
		message: "请输入创建人",
		trigger: "change",
	}, ],
	group: [{
		required: true,
		message: "请输入组别",
		trigger: "change",
	}, ],
	phone: [{
			required: true,
			message: "请输入手机号",
			trigger: "change",
		},
		{
			pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
			message: "请输入合法手机号/电话号",
			trigger: "blur"
		},
	],
};
