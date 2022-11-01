import instance from "./index.js";
export const postAction = (url, payload) => {
  return instance.post(url, payload);
};
