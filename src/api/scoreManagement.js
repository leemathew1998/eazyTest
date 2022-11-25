import { postAction } from "./action.js";
export const getList = (payload) => {
  return postAction(`/api/examInfo/selAll`, payload);
};
export const getExamScoreList = (payload) => {
  return postAction(`/api/examInfo/selectExam`, payload);
};
export const getExamScoreListDetail = (payload) => {
  return postAction(`/api/examInfo/examInfo`, payload);
}