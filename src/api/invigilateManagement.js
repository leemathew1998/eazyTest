import { postAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/examManage/selectAll`, payload);
};
export const addOneExam = (payload) => {
  return postAction(`/api/examManage/add`, payload);
};
