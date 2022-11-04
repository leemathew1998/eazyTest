export const modalRules = {
  rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }],
  roleList: [
    {
      required: true,
      message: "请选择权限",
      trigger: "blur",
    },
  ],
};

export const treeData = [
  {
    label: "用户管理",
    children: [
      {
        disabled: true,
        label: "查询用户",
      },
      {
        label: "修改用户",
      },
      {
        label: "删除用户",
      },
      {
        label: "增加用户",
      },
    ],
  },
  {
    label: "角色管理",
    children: [
      {
        disabled: true,
        label: "查询角色",
      },
      {
        label: "修改角色",
      },
      {
        label: "删除角色",
      },
      {
        label: "增加角色",
      },
    ],
  },
];
