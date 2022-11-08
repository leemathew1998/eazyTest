import { postAction, getAction } from "@/api/action.js";
export const getList = (payload) => {
  return postAction(`/api/examT/selectAll`, payload);
};

export const deleteQuestion = (payload) => {
  return getAction(`/api/examT/delete?tid=${payload}`);
};
