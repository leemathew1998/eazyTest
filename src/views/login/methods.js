import CryptoJS from "crypto-js";
import { reactive } from "vue";
import { getInfoAndRoutes, getMenuPemission, getRoutes } from "@/api/user.js";
import { useAppStore, useUserStore } from "@/store";
import router from "@/router";
import { useRoute } from "vue-router";
import { transform, transformExamLayout, mainLayoutPath } from "@/router/router.js";
const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
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

const solveMenuButtonList = ({ checkList, menuList }) => {
  // 开始递归
  const menuData = {};
  menuList.forEach((item) => {
    if (checkList.includes(item.menuId)) {
      //开始循环孩子
      if (item.children.length > 0) {
        menuData[item.name] = walkChildren(item.children, checkList);
      } else {
        menuData[item.name] = ["查询"];
      }
    }
  });
  userStore.menuLicenses = menuData;
};
const walkChildren = (childrens, checkList) => {
  return childrens.map((item) => (checkList.includes(item.menuId) ? item.name : ""));
};
export const solveMenuList = (menuList, toPath) => {
  const components = import.meta.glob("../../views/**/*.vue");
  let redirect = -1;
  let redirectName = "";
  //开始遍历
  let mainLayout = [];
  let examLayout = [];
  menuList.forEach((route) => {
    if (mainLayoutPath.find((item) => item === route.path)) {
      //处理redirect
      if (redirect < transform[route.path].index) {
        redirect = transform[route.path].index;
        redirectName = route.path;
      }

      mainLayout.push({
        path: route.path,
        name: route.name,
        component: components[transform[route.path].path],
      });
    } else {
      let flag = false;
      if (route.path === "/exam/userManagement") {
        redirect = 999;
        redirectName = "/exam/userManagement";
        flag = true;
        examLayout.push({
          path: "/exam/examing",
          name: "线上考试",
          component: components[transformExamLayout["/exam/examing"]],
        });
      }
      if (flag) {
        examLayout.push({
          path: route.path,
          name: route.name,
          component: components[transformExamLayout[route.path]],
        });
      }
    }
  });
  //需要处理一些特殊的路由，如果有按钮权限，那就把路由添加进去
  //剩余examLayout就需要看看有没有按钮权限了
  if (userStore.menuLicenses["试卷管理"]?.includes("新增")) {
    examLayout.push({
      path: "/exam/manualRenderPaper",
      name: "手动组卷",
      component: components[transformExamLayout["/exam/manualRenderPaper"]],
    });
  }
  if (userStore.menuLicenses["阅卷评分"]?.includes("修改")) {
    examLayout.push({
      path: "/exam/review",
      name: "阅卷管理",
      component: components[transformExamLayout["/exam/review"]],
    });
  }
  if (mainLayout.length > 0) {
    router.addRoute({
      path: "/",
      name: "main",
      component: () => import("@/components/basicLayout/index.vue"),
      children: mainLayout,
    });
  }
  if (examLayout.length > 0) {
    router.addRoute("exam", {
      path: "/exam",
      name: "exam",
      component: () => import("@/components/basicLayout/examLayout.vue"),
      children: examLayout,
    });
  }
  //开始处理topath没有的情况，就是第一次登陆，需要怎么跳转的问题
  if (toPath) {
    router.push(toPath);
  } else {
    router.push(redirectName);
  }
};
const saveLocalStore = (data) => {
  //最后保存一下
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      username: userStore.username,
      password: userStore.password,
      userId: userStore.userId,
      roleId: userStore.roleId,
      menuLicenses: userStore.menuLicenses,
      token: userStore.token,
      routers: userStore.routers,
    }),
  );
};

export const addRoutes = async () => {
  const [roleId, routers] = await getInfoAndRoutes();
  if (roleId.code === 200) {
    // 获取roleId;
    userStore.roleId = roleId.data[0];
  }
  //获取按钮基本权限
  const res = await getMenuPemission({
    userId: userStore.userId,
    roleId: userStore.roleId,
  });
  if (res.code === 200) {
    solveMenuButtonList(res.data);
  }
  //最后处理路由
  if (routers.code === 200 && routers.success) {
    userStore.routers = routers.data;
    solveMenuList(routers.data);
  }
  //最后保存一下
  saveLocalStore();
};
