export const modalRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
  createdBy: [
    {
      required: true,
      message: "请输入创建人",
      trigger: "change",
    },
  ],
  group: [
    {
      required: true,
      message: "请输入组别",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择角色",
      trigger: "change",
    },
  ],
};
