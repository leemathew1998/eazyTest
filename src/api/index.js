import axios from "axios";
import pinia from "@/store/pinia.js";
import { useUserStore, useExamStore, useAppStore } from "@/store";
import router from "@/router/index.js";
import { ElNotification } from "element-plus";
const examStore = useExamStore(pinia);
const appStore = useAppStore(pinia);
const userStore = useUserStore(pinia);
//创建axios的一个实例
var instance = axios.create({
  baseURL: "http://192.168.3.20:20221", //接口统一域名
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
    // console.log(response);
    if (response.data.code === 500 && response.data.message.includes("token")) {
      appStore.MyReset();
      examStore.MyReset();
      userStore.MyReset();
      localStorage.clear();
      ElNotification.error("登录失效！请重新登录");
      router.push("/login");
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    ElNotification.error(error.message);
    return Promise.resolve(error);
  },
);

export default instance;
