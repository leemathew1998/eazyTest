import { getAction, postAction } from "./action.js";

export const getInfoAndRoutes = () => {
  return Promise.all([getAction(`/api/user/getInfo`), getAction(`/api/user/getMenuList`)]);
};

export const getCaptcha = () => {
  return postAction("/api/user/vc.jpg");
};

export const pushLogin = (payload) => {
  return postAction("/api/user/login", payload);
};
