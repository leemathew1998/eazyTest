import CryptoJS from "crypto-js";
import { reactive } from "vue";
import { getInfoAndRoutes } from "@/api/user.js";
import { useRouter, useRoute } from "vue-router";
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

const routerMap = {
  "/dashboard": "@/views/dashboard/index.vue",
  "/userManagement": "@/views/userManagement/index.vue",
  "/roleManagement": "@/views/roleManagement/index.vue",
  "/questionBankManagement": "@/views/questionBankManagement/index.vue",
  "/examBankManagement": "@/views/examBankManagement/index.vue",
  "/reviewManagement": "@/views/reviewManagement/index.vue",
  "/invigilateManagement": "@/views/invigilateManagement/index.vue",
  "/scoreManagement": "@/views/scoreManagement/index.vue",
  "/exam/userManagement": "@/views/userManagement/personPage.vue",
};
export const solveInfoAndRouters = async () => {
  const router = useRouter();
  const route = useRoute();
  // const [userInfo, routers] = await getInfoAndRoutes();
  // if (userInfo.code === 200) {
  //   // 实际上也没啥用;
  // }
  // if (routers.code === 200) {
  //   routers.data.forEach((route) => {
  //     if (route.path.indexOf("/", 1) !== -1) {
  //       // 代表需要添加到exam底下去
  //     } else {
  //       router.addRoute("main", {
  //         path: route.path,
  //         name: route.name,
  //         component: () => import(routerMap[route.path]),
  //       });
  //       // 添加到main路由底下去
  //     }
  //   });
  // }
  console.log(route, router);
};
