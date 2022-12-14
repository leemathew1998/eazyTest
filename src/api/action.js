import instance from "./index.js";
export const postAction = (url, payload) => {
  return instance.post(url, payload);
};
export const getAction = (url, payload) => {
  return instance.get(url, payload);
};

export const getFile = (url, payload) => {
  return instance({
    responseType: "blob",
    url: url,
    method: "get",
  });
};

export const uploadFile = (url, payload) => {
  return instance({
    url: url,
    headers: { "Content-Type": "multipart/form-data" },
    method: "post",
    data: payload,
  });
};
