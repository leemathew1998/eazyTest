import { postAction, getAction } from "./action.js";
export const getList = (payload) => {
  return postAction("/api/user/list", payload);
};
export const addUser = (payload) => {
  return postAction(`/api/user/add`, payload);
};
export const updateUser = (payload) => {
  return postAction(`/api/user/update`,payload);
};

export const deleteUser = (payload) => {
  return postAction(`/api/user/delete?id=${payload}`);
};
