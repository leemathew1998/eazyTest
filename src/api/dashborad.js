import { postAction } from "./action.js";

export const getLoginList = () => {
  return postAction(`/api/log/logSuccess`);
};
export const getCount = () => {
  return Promise.all([
    postAction(`/api/examInfo/examPerCount`, {
      knowGory: "1",
    }),
    postAction(`/api/examInfo/examPerCount`, {
      knowGory: "2",
    }),
    postAction(`/api/examInfo/examPerCount`, {
      knowGory: "3",
    }),
    postAction(`/api/examInfo/examPerCount`, {
      knowGory: "4",
    }),
  ]);
};
