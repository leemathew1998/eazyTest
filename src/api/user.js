import { postAction } from "./action.js";
import { useUserStore } from "@/store";
const userStore = useUserStore();
export const getInfoAndRoutes = (userId) => {
  return Promise.all([
    postAction(`/api/user/getRoleByUserId?userId=${userStore.userId}`),
    postAction(`/api/user/getMenuList`),
  ]);
};

export const getMenuPemission = (payload) => {
  return postAction("/api/role/getAssignMenuTree", payload);
};

export const asyncRoutes = () => {
  return postAction(`/api/user/getMenuList`);
};

export const getCaptcha = () => {
  return postAction("/api/user/vc.jpg");
};

export const pushLogin = (payload) => {
  return postAction("/api/user/login", payload);
};

export const logout = () => {
  return postAction("/api/user/logout");
};
