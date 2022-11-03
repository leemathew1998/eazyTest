import { getAction, postAction } from "./action.js";

export const getInfoAndRoutes = () => {
  return Promise.all([postAction(`/api/user/getInfo`), postAction(`/api/user/getMenuList`)]);
};

export const asyncRoutes = ()=>{
  return postAction(`/api/user/getMenuList`)
}

export const getCaptcha = () => {
  return postAction("/api/user/vc.jpg");
};

export const pushLogin = (payload) => {
  return postAction("/api/user/login", payload);
};
