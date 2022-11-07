import dashboard from "@/views/dashboard/index.vue";
import userManagement from "@/views/userManagement/index.vue";
import roleManagement from "@/views/roleManagement/index.vue";
import questionBankManagement from "@/views/questionBankManagement/index.vue";
import examBankManagement from "@/views/examBankManagement/index.vue";
import reviewManagement from "@/views/reviewManagement/index.vue";
import invigilateManagement from "@/views/invigilateManagement/index.vue";
import scoreManagement from "@/views/scoreManagement/index.vue";

import exam_examing from "@/views/onExam/examing.vue";
import exam_manualRender from "@/views/examBankManagement/manualRender.vue";
import exam_review from "@/views/reviewManagement/reviewExam.vue";
import exam_userManagement from "@/views/userManagement/personPage.vue";

export const constantsRoutes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/components/basicLayout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "首页",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/dashboard/index.vue"),
      },
      {
        path: "/userManagement",
        name: "用户管理",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/userManagement/index.vue"),
      },
      {
        path: "/roleManagement",
        name: "角色管理",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/roleManagement/index.vue"),
      },
      {
        path: "/questionBankManagement",
        name: "题库管理",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/questionBankManagement/index.vue"),
      },
      {
        path: "/examBankManagement",
        name: "试卷管理",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/examBankManagement/index.vue"),
      },
      {
        path: "/reviewManagement",
        name: "阅卷评分",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/reviewManagement/index.vue"),
      },
      {
        path: "/invigilateManagement",
        name: "监考管理",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/invigilateManagement/index.vue"),
      },
      {
        path: "/scoreManagement",
        name: "成绩查询",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/scoreManagement/index.vue"),
      },
      {
        path: "/noop",
        name: "noop",
        meta: {
          transition: "animated fadeInLeft",
        },
        component: () => import("@/views/scoreManagement/index.vue"),
      },
    ],
  },
  {
    path: "/exam",
    name: "exam",
    component: () => import("@/components/basicLayout/examLayout.vue"),
    children: [
      {
        path: "/exam/examing",
        name: "考试页面",
        meta: {
          transition: "animated fadeInUp",
        },
        component: () => import("@/views/onExam/examing.vue"),
      },
      {
        path: "/exam/manualRenderPaper",
        name: "手动出卷",
        meta: {
          transition: "animated fadeInUp",
        },
        component: () => import("@/views/examBankManagement/manualRender.vue"),
      },
      {
        path: "/exam/review",
        name: "阅卷管理",
        meta: {
          transition: "animated fadeInUp",
        },
        component: () => import("@/views/reviewManagement/reviewExam.vue"),
      },
      {
        path: "/exam/userManagement",
        name: "个人管理",
        meta: {
          transition: "animated fadeInUp",
        },
        component: () => import("@/views/userManagement/personPage.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/exception/404.vue"),
  },
];

export const asyncRoutes = {
  "/dashboard": {
    path: "/dashboard",
    name: "首页",
    component: () => import("@/views/dashboard/index.vue"),
  },
  "/userManagement": {
    path: "/userManagement",
    name: "用户管理",
    component: userManagement,
  },
  "/roleManagement": {
    path: "/roleManagement",
    name: "权限管理",
    component: roleManagement,
  },
  "/questionBankManagement": {
    path: "/questionBankManagement",
    name: "题库管理",
    component: questionBankManagement,
  },
  "/examBankManagement": {
    path: "/examBankManagement",
    name: "试卷管理",
    component: examBankManagement,
  },
  "/reviewManagement": {
    path: "/reviewManagement",
    name: "阅卷评分",
    component: reviewManagement,
  },
  "/invigilateManagement": {
    path: "/invigilateManagement",
    name: "监考管理",
    component: invigilateManagement,
  },
  "/scoreManagement": {
    path: "/scoreManagement",
    name: "成绩查询",
    component: scoreManagement,
  },
  "/exam/examing": {
    path: "/exam/examing",
    name: "考试页面",
    component: exam_examing,
  },
  "/exam/manualRenderPaper": {
    path: "/exam/manualRenderPaper",
    name: "手动出卷",
    component: exam_manualRender,
  },
  "/exam/review": {
    path: "/exam/review",
    name: "阅卷管理",
    component: exam_review,
  },
  "/exam/userManagement": {
    path: "/exam/userManagement",
    name: "个人管理",
    component: exam_userManagement,
  },
};

/*
 *@Author: jkwei
 *@Date: 2022-11-03 11:01:46
 *@Description: 

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
        path: "/roleManagement",
        name: "权限管理",
        component: () => import("@/views/roleManagement/index.vue"),
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
        name: "阅卷评分",
        component: () => import("@/views/reviewManagement/index.vue"),
      },
      {
        path: "/invigilateManagement",
        name: "监考管理",
        component: () => import("@/views/invigilateManagement/index.vue"),
      },
      {
        path: "/scoreManagement",
        name: "成绩查询",
        component: () => import("@/views/scoreManagement/index.vue"),
      },
    ],



        children: [
      {
        path: "/exam/examing",
        name: "考试页面",
        component: () => import("@/views/onExam/examing.vue"),
      },
      {
        path: "/exam/manualRenderPaper",
        name: "手动出卷",
        component: () => import("@/views/examBankManagement/manualRender.vue"),
      },
      {
        path: "/exam/review",
        name: "阅卷管理",
        component: () => import("@/views/reviewManagement/reviewExam.vue"),
      },
      {
        path: "/exam/userManagement",
        name: "个人管理",
        component: () => import("@/views/userManagement/personPage.vue"),
      },
    ],
*/
