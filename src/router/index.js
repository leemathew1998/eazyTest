import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/components/basicLayout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "首页",
        component: () => import("@/views/dashboard/index.vue"),
      },
      {
        path: "/userManagement",
        name: "用户管理",
        component: () => import("@/views/userManagement/index.vue"),
      },
      {
        path: "/questionBankManagement",
        name: "题库管理",
        component: () => import("@/views/questionBankManagement/index.vue"),
      },
      {
        path: "/examBankManagement",
        name: "试卷管理",
        component: () => import("@/views/examBankManagement/index.vue"),
      },
      {
        path: "/reviewManagement",
        name: "阅卷管理",
        component: () => import("@/views/reviewManagement/index.vue"),
      },
      {
        path: "/scoreManagement",
        name: "成绩展示",
        component: () => import("@/views/scoreManagement/index.vue"),
      },
    ],
  },
  {
    path: "/exam",
    name: "考试模块",
    component: () => import("@/components/basicLayout/examLayout.vue"),
    children: [
      {
        path: "/exam/examing",
        name: "考试页面",
        component: () => import("@/views/onExam/examing.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
