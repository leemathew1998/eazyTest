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

export const changePaperUseCount = (payload) => {
  return postAction(`/api/examPaperInfo/useNum`, payload);
};

export const submitAnswers = (payload) => {
  return postAction(`/api/ansRecord/save?examPaperId=${payload}`);
};

export const hasAbnormal = (payload) => {
  return postAction(`/api/examInfo/abnormal`, payload);
};
