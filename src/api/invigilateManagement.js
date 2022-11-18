import { getAction, postAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/examManage/selectAll`, payload);
};
export const addOneExam = (payload) => {
  return postAction(`/api/examManage/add`, payload);
};

export const deleteOneExam = (payload) => {
  return postAction(`/api/examManage/del?examId=${payload}`);
};
export const updateOneExam = (payload) => {
  return postAction(`/api/examManage/update`, payload);
};
