export const constantsRouters = [
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

export const transform = {
  "/dashboard": {
    path: "../dashboard/index.vue",
    index: 10,
  },
  "/userManagement": {
    path: "../userManagement/index.vue",
    index: 9,
  },
  "/roleManagement": {
    path: "../roleManagement/index.vue",
    index: 8,
  },
  "/questionBankManagement": {
    path: "../questionBankManagement/index.vue",
    index: 7,
  },
  "/examBankManagement": {
    path: "../examBankManagement/index.vue",
    index: 6,
  },
  "/reviewManagement": {
    path: "../reviewManagement/index.vue",
    index: 5,
  },
  "/invigilateManagement": {
    path: "../invigilateManagement/index.vue",
    index: 4,
  },
  "/scoreManagement": {
    path: "../scoreManagement/index.vue",
    index: 3,
  },
};
export const mainLayoutPath = [
  "/dashboard",
  "/userManagement",
  "/roleManagement",
  "/questionBankManagement",
  "/examBankManagement",
  "/reviewManagement",
  "/invigilateManagement",
  "/scoreManagement",
];
export const transformExamLayout = {
  "/exam/examing": "../onExam/examing.vue",
  "/exam/manualRenderPaper": "../examBankManagement/manualRender.vue",
  "/exam/review": "../reviewManagement/reviewExam.vue",
  "/exam/userManagement": "../userManagement/personPage.vue",
};
