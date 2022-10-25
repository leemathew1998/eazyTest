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
        name: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
      },
      {
        path: "/userManagement",
        name: "userManagement",
        component: () => import("@/views/userManagement/index.vue"),
      },
      {
        path: "/questionBankManagement",
        name: "questionBankManagement",
        component: () => import("@/views/questionBankManagement/index.vue"),
      },
      {
        path: "/examBankManagement",
        name: "examBankManagement",
        component: () => import("@/views/examBankManagement/index.vue"),
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
