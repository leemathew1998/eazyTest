import CryptoJS from "crypto-js";
import { reactive } from "vue";
import { getInfoAndRoutes, getMenuPemission, getRoutes } from "@/api/user.js";
import { useAppStore, useUserStore } from "@/store";
import router from "@/router";
import { transform, transformExamLayout } from "@/router/router.js";
const userStore = useUserStore();
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
const walkChildren = (childrens, checkList) => {
  return childrens.map((item) => (checkList.includes(item.menuId) ? item.name : ""));
};
export const solveMenuList = (menuList) => {
  const components = import.meta.glob("../../views/**/*.vue");
  //如果有主页面的路由，就先添加layout！
  let needRedirect = -1;
  console.log(menuList);
  if (menuList.find((item) => Object.keys(transform).includes(item.path))) {
    router.addRoute({
      path: "/",
      name: "main",
      meta: {
        transition: "animated fadeInLeft",
      },
      component: () => import("@/components/basicLayout/index.vue"),
      redirect: "",
    });
  }
  //开始遍历
  menuList.forEach((route) => {
    if (Object.keys(transform).find((item) => item === route.path)) {
      if (needRedirect < transform[route.path].index) {
        //处理main页面的redirect
        needRedirect = transform[route.path].index;
        router.getRoutes().find((item) => item.name === "main").redirect = route.path;
      }
      router.addRoute("main", {
        path: route.path,
        name: route.name,
        meta: {
          transition: "animated fadeInLeft",
        },
        component: components[transform[route.path].path],
      });
    } else {
      router.addRoute("exam", {
        path: route.path,
        name: route.name,
        meta: {
          transition: "animated fadeInUp",
        },
        component: components[transformExamLayout[route.path]],
      });
      if (route.path === "/exam/userManagement") {
        router.addRoute("exam", {
          path: "/exam/examing",
          name: "线上考试",
          meta: {
            transition: "animated fadeInUp",
          },
          component: components[transformExamLayout["/exam/examing"]],
        });
      }
    }
  });
  //添加完成，需要找出需要redirect的路径
  if (needRedirect != -1) {
    router.push("/");
  } else {
    router.push("/exam/userManagement");
  }
};
export const addRoutes = async () => {
  const [userInfo, routers] = await getInfoAndRoutes();
  if (userInfo.code === 200) {
    // 获取roleId;
    userStore.roleId = userInfo.data[0];
  }
  if (routers.code === 200 && routers.success) {
    userStore.routers = routers.data;
    solveMenuList(routers.data);
  }
  //获取按钮基本权限
  const res = await getMenuPemission({
    userId: userStore.userId,
    roleId: userInfo.data[0],
  });
  if (res.code === 200) {
    solveMenuButtonList(res.data);
  }
};

export const onlyGetRoutes = async () => {
  const res = await getRoutes();
  if (res.code === 200 && res.success) {
    solveMenuList(res.data);
  }
};
