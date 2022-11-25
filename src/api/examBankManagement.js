import { postAction, getAction } from "@/api/action.js";
export const getList = (payload) => {
  return postAction(`/api/examPaperInfo/selectAll`, payload);
};

export const deleteExam = (payload) => {
  return getAction(`/api/examPaperInfo/delete?id=${payload}`);
};

export const addQuestion = (payload) => {
  return postAction(`/api/examT/add`, payload);
};

export const addExam = (payload) => {
  return postAction(`/api/examPaperInfo/addOrUpdate`, payload);
};

export const addExamAuto = (payload) => {
  return postAction(`/api/examPaperInfo/save`, payload);
};
export const previewExamPaper = (payload) => {
  return postAction(`/api/examManage/selPaper`, payload);
};
export const previewExamPaperWithAnswers = (payload) => {
  return postAction(`api/examManage/selectPaper`, payload);
};

export const changePaperUseCount = (payload) => {
  return postAction(`/api/examPaperInfo/useNum`, payload);
};

export const submitAnswers = (payload) => {
  //实时交卷
  return postAction(`/api/ansRecord/save`, payload);
};

export const submitAnswers2 = (payload) => {
  //最后交卷
  return postAction(`/api/ansRecord/add`, payload);
};

export const hasAbnormal = (payload) => {
  return postAction(`/api/examInfo/abnormal`, payload);
};

export const updateCodingScore = (payload) => {
  return postAction("/api/ansRecord/updateScore", payload);
};

export const updateExamStatus = (payload) => {
  return postAction("/api/examInfo/isTrue", payload);
};
