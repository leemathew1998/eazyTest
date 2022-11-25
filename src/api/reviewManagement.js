import { postAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/examManage/select`, payload);
};
export const getScoringList = (payload) => {
  return postAction(`/api/ansRecord/shortAnswer`, payload);
}
export const updateScoringStatus = (payload) => {
  return postAction(`/api/examInfo/markStatus`, payload);
}