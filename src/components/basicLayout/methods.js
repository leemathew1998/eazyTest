import { useUserStore, useAppStore, useExamStore } from "@/store";
import { logout } from "@/api/user.js";
import { ElNotification } from "element-plus";
import router from "@/router";
import { nextTick } from "vue";
const userStore = useUserStore();
const examStore = useExamStore();
const appStore = useAppStore();
export const logoutAccount = async () => {
  const res = await logout();
  if (res.code === 200) {
    ElNotification.success("退出成功！");
    router.push("/login");
  } else {
    ElNotification.error("退出失败！");
  }
};

export const menusName = [
  {
    name: "首页",
    path: "/dashboard",
  },
  {
    name: "用户管理",
    path: "/userManagement",
  },
  {
    name: "角色管理",
    path: "/roleManagement",
  },
  {
    name: "题库管理",
    path: "/questionBankManagement",
  },
  {
    name: "试卷管理",
    path: "/examBankManagement",
  },
  {
    name: "阅卷评分",
    path: "/reviewManagement",
  },
  {
    name: "监考管理",
    path: "/invigilateManagement",
  },
  {
    name: "成绩查询",
    path: "/scoreManagement",
  },
];