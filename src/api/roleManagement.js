import { postAction } from "./action.js";
export const getList = () => {
  return postAction(`/api/role/list`);
};
