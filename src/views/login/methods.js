import CryptoJS from "crypto-js";
import { reactive } from "vue";
import { getInfoAndRoutes, getMenuPemission } from "@/api/user.js";
import { useRouter } from "vue-router";
import { useAppStore, useUserStore } from "@/store";
import router from "@/router";
const userStore = useUserStore();
// const router = useRouter();
const appStore = useAppStore();
export const usernameValidate = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入用户名!"));
  } else {
    callback();
  }
};
export const passwordValidate = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码!"));
  } else {
    callback();
  }
};

export const codeValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入验证码!"));
  } else {
    callback();
  }
};

export const CryptojsSet = (word, keyStr) => {
  keyStr = keyStr || "abcdef0123456789"; // 16位的密钥，自己定义，和下面的密钥要相同
  var srcs = CryptoJS.enc.Utf8.parse(word); //  字符串到数组转换，解析明文
  var key = CryptoJS.enc.Utf8.parse(keyStr); //  字符串到数组转换，解析秘钥
  // mode:加密方式；padding:填充方式；iv便宜向量（可选）
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString(); // 加密后的结果是对象，要转换为文本
};

/**
 * @description: 解密
 * @param {*} word
 * @param {*} keyStr
 */
export const CryptojsGet = (word, keyStr) => {
  keyStr = keyStr || "abcdef0123456789";
  var key = CryptoJS.enc.Utf8.parse(keyStr); //  字符串到数组转换
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString(); //  数组到字符串转换
};

export const ruleForm = reactive({
  username: "",
  password: "",
  code: "",
});

export const rules = reactive({
  username: [
    {
      validator: usernameValidate,
      trigger: "blur",
    },
  ],
  password: [
    {
      validator: passwordValidate,
      trigger: "blur",
    },
  ],
  code: [
    {
      validator: codeValidate,
      trigger: "change",
    },
  ],
});

const fackRouters = [
  {
    path: "/dashboard",
    name: "首页",
    componentName: "/views/dashboard/index.vue",
  },
  {
    path: "/userManagement",
    name: "用户管理",
    componentName: "/views/userManagement/index.vue",
  },
  {
    path: "/roleManagement",
    name: "角色管理",
    componentName: "/views/roleManagement/index.vue",
  },
  {
    path: "/questionBankManagement",
    name: "题库管理",
    componentName: "/views/questionBankManagement/index.vue",
  },
  {
    path: "/examBankManagement",
    name: "试卷管理",
    componentName: "/views/examBankManagement/index.vue",
  },
  {
    path: "/reviewManagement",
    name: "阅卷评分",
    componentName: "/views/reviewManagement/index.vue",
  },
  {
    path: "/invigilateManagement",
    name: "监考管理",
    componentName: "/views/invigilateManagement/index.vue",
  },
  {
    path: "/scoreManagement",
    name: "成绩查询",
    componentName: "/views/scoreManagement/index.vue",
  },
];
export const transform = {
  "/dashboard": "../dashboard/index.vue",
  "/userManagement": "../userManagement/index.vue",
  "/roleManagement": "../roleManagement/index.vue",
  "/questionBankManagement": "../questionBankManagement/index.vue",
  "/examBankManagement": "../examBankManagement/index.vue",
  "/reviewManagement": "../reviewManagement/index.vue",
  "/invigilateManagement": "../invigilateManagement/index.vue",
  "/scoreManagement": "../scoreManagement/index.vue",
};
export const addRoutes = () => {
  const components = import.meta.glob("../../views/**/*.vue");
  console.log(components);
  router.addRoute({
    path: "/",
    name: "main",
    component: () => import("@/components/basicLayout/index.vue"),
    redirect: "/dashboard",
  });
  fackRouters.forEach((route) => {
    router.addRoute("main", {
      path: route.path,
      name: route.name,
      component: components[transform[route.path]],
    });
  });
  console.log(router.getRoutes());
  router.push("/dashboard");
};
