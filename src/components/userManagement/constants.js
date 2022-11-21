import { ref, reactive } from "vue";
import { getList } from "@/api/roleManagement.js";
import { getList as getUser } from "@/api/userManagement.js";
import { assignRoleToUser } from "@/api/userManagement.js";
export const modalRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
    { min: 6, max: 16, message: "密码长度在6位至16位之间", trigger: "change" },
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
  role: [
    {
      required: true,
      message: "请选择角色",
      trigger: "change",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
    {
      pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
      message: "请输入合法手机号/电话号",
      trigger: "blur",
    },
  ],
});

export const passwordInputSuffixIcon = ref("password");
export const ruleFormRef = ref();
export const ruleForm = reactive({
  username: "",
  password: "",
  createBy: "",
  group: "",
  role: "",
  phone: null,
});

//重置密码
export const showPasswordInput = ref(false);
export const resetPassword = () => {
  showPasswordInput.value = !showPasswordInput.value;
};

//角色列表
export const roleList = reactive({
  value: [],
});
export const formLoading = ref(false);
export const loadRoleList = async (userId) => {
  formLoading.value = true;
  const res = await getList({
    pageNo: 1,
    pageSize: 10000,
    userId: userId,
  });
  if (res.code === 200 && res.success) {
    roleList.value = res.data.records;
  }
  formLoading.value = false;
};

export const getOneUser = async (payload) => {
  const roleIds = payload.roleIds;
  let userId = null;
  delete payload.roleIds;
  payload.pageNo = 1;
  payload.pageSize = 1;

  const res = await getUser(payload);
  if (res.code === 200 && res.success) {
    userId = res.data.records[0].userId;
  }
  const payload2 = {
    userId: userId || "",
    roleIds: roleIds,
  };
  return assignRoleToUser(payload2);
};
