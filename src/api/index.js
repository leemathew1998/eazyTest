import axios from "axios";
import pinia from "@/store/pinia.js";
import { useUserStore } from "@/store";
import router from "@/router/index.js";
import { ElNotification } from "element-plus";
const userStore = useUserStore(pinia);
//创建axios的一个实例
var instance = axios.create({
  // baseURL: "http://localhost:20221", //接口统一域名
  // baseURL: "http://10.168.4.233:20221", //接口统一域名
  // baseURL: "http://120.48.98.135:20221",
  baseURL: "",
  timeout: 6000, //设置超时
  headers: {
    "Content-Type": "application/json",
  },
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.url === "/api/user/login") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
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
    if (response.data.code === 500 && response.data.message.includes("token")) {
      ElNotification.error("登录失效！请重新登录");
      router.push("/login");
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    ElNotification({
      title: "请求失败",
      message: error.message,
      type: "error",
    });
    return Promise.resolve(error);
  },
);

export default instance;
