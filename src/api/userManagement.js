import { postAction, getAction } from "./action.js";
export const getList = (payload) => {
  return postAction("/api/user/getRoleByUserId", payload);
};
export const addUser = () => {
  return postAction(`/api/user/add`);
};
export const updateUser = () => {
  return postAction(`/api/user/update`);
};

export const deleteUser = () => {
  return postAction(`/api/user/delete`);
};
