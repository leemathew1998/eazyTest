import CryptoJS from "crypto-js";
import { reactive } from "vue";
import { getInfoAndRoutes } from "@/api/user.js";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store";

import dashboard from "@/views/dashboard/index.vue";
import userManagement from "@/views/userManagement/index.vue";
import roleManagement from "@/views/roleManagement/index.vue";
import questionBankManagement from "@/views/questionBankManagement/index.vue";
import examBankManagement from "@/views/examBankManagement/index.vue";
import reviewManagement from "@/views/reviewManagement/index.vue";
import invigilateManagement from "@/views/invigilateManagement/index.vue";
import scoreManagement from "@/views/scoreManagement/index.vue";
import exam_userManagement from "@/views/userManagement/personPage.vue";

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

/*
 *@Author: jkwei
 *@Date: 2022-11-03 13:55:57
 *@Description: 无奈之举，可以懒加载就好了
 */
const routerMap = {
  "/dashboard": dashboard,
  "/userManagement": userManagement,
  "/roleManagement": roleManagement,
  "/questionBankManagement": questionBankManagement,
  "/examBankManagement": examBankManagement,
  "/reviewManagement": reviewManagement,
  "/invigilateManagement": invigilateManagement,
  "/scoreManagement": scoreManagement,
  "/exam/userManagement": exam_userManagement,
};
export const solveInfoAndRouters = async () => {
  const router = useRouter();
  const appStore = useAppStore();
  const [userInfo, routers] = await getInfoAndRoutes();
  if (userInfo.code === 200) {
    // 实际上也没啥用;
  }
  const router_temp_to_push = [];
  const mapMainAndExamLocation = {
    exam: -1,
    main: -1,
  };
  if (routers.code === 200) {
    routers.data.forEach((route) => {
      if (route.path.indexOf("/", 1) !== -1) {
        if (!router_temp_to_push.find((item) => item.name === "exam")) {
          // 没有相关的父亲路由
          mapMainAndExamLocation.exam = router_temp_to_push.length;
          router_temp_to_push.push({
            path: "/exam",
            name: "exam",
            component: () => import("@/components/basicLayout/examLayout.vue"),
            children: [],
          });
        }
        // 开始推了
        router_temp_to_push[mapMainAndExamLocation.exam].children.push({
          path: route.path,
          name: route.name,
          component: routerMap[route.path],
        });
      } else {
        if (!router_temp_to_push.find((item) => item.name === "main")) {
          // 没有相关的父亲路由
          mapMainAndExamLocation.main = router_temp_to_push.length;
          router_temp_to_push.push({
            path: "/",
            name: "main",
            component: () => import("@/components/basicLayout/index.vue"),
            redirect: "/dashboard",
            children: [],
          });
        }
        // 开始推了
        router_temp_to_push[mapMainAndExamLocation.main].children.push({
          path: route.path,
          name: route.name,
          component: routerMap[route.path],
        });
      }
    });
  }
  // 存入pinia和local中
  appStore.remoteRoutes = router_temp_to_push;
  localStorage.setItem(
    "remoteRoutes",
    JSON.stringify({
      remoteRoutes: router_temp_to_push,
    }),
  );
  router_temp_to_push.forEach((item) => router.addRoute(item));
};
