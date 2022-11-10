import { postAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/examInfo/selAll`, payload);
};
