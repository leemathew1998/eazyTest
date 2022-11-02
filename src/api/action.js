import instance from "./index.js";
export const postAction = (url, payload) => {
  return instance.post(url, payload);
};
export const getAction = (url, payload) => {
  return instance.get(url, payload);
};