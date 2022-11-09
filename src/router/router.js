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
export const allRouterName = [
  "首页",
  "个人管理",
  "用户管理",
  "角色管理",
  "题库管理",
  "试卷管理",
  "阅卷评分",
  "监考管理",
  "成绩查询",
];

export const whiteList = ["考试页面", "手动出卷", "阅卷管理", "main", "exam", "login", "404"];

export const mainRouters = {
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
  ],
};
