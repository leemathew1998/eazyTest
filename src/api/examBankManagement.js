import { postAction, getAction } from "@/api/action.js";
export const getList = (payload) => {
  return postAction(`/api/examPaperInfo/selectAll`, payload);
};

export const deleteExam = (payload) => {
  return getAction(`/api/examPaperInfo/delete?id=${payload}`);
};

export const addQuestion = (payload)=>{
    return postAction(`/api/examT/add`,payload)
}