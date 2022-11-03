import { postAction,getAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/role/list`,payload);
};
export const deleteRole = (id)=>{
  return getAction(`/api/role/delete?id=${id}`);
}