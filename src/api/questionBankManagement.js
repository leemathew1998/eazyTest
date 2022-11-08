import { postAction } from "@/api/action.js";
export const getList = (payload) => {
  return postAction(`/api/examT/selectAll`, payload);
};
