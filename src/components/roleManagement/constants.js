export const modalRules = {
  rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleList: [
    {
      required: true,
      message: "请选择权限",
      trigger: "blur",
    },
  ],
};
