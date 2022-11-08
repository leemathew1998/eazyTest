import { postAction, getAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/role/list`, payload);
};
export const deleteRole = (id) => {
  return getAction(`/api/role/delete?id=${id}`);
};
export const getPermissions = (payload) => {
  return postAction("/api/role/getAssignMenuTree", payload);
};

export const addRole = (payload) => {
  return postAction("/api/role/add", payload);
};
export const updateRole = (payload) => {
  return postAction("/api/role/update", payload);
};
export const updateRoleMenuList = (payload)=>{
  return postAction(`/api/role/saveRoleAssign`,payload)
}
