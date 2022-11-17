import { postAction } from "./action.js";

export const getLoginList = (payload) => {
  return postAction(`/api/log/logSuccess`, payload);
};
export const getCount = () => {
  return postAction(`/api/examInfo/examPerCount`);
};

export const getScore = () => {
  return postAction(`/api/examInfo/examScoreCount`);
};
