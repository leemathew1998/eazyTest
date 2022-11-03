import axios from "axios";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store";
const userStore = useUserStore(pinia);
//创建axios的一个实例
var instance = axios.create({
  baseURL: "http://10.168.4.233:20221", //接口统一域名
  timeout: 6000, //设置超时
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.url === "/api/user/login") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers["token"] = userStore.token;
    return config;
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error),
);

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

export default instance;
