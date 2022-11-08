import { useUserStore, useAppStore, useExamStore } from "@/store";
import { logout } from "@/api/user.js";
import { ElNotification } from "element-plus";
import router from "@/router";
import { nextTick } from "vue";
const userStore = useUserStore();
const examStore = useExamStore();
const appStore = useAppStore();
export const logoutAccount = async () => {
  const res = await logout();
  if (res.code === 200) {
    ElNotification.success("退出成功！");
    localStorage.clear();
    router.push("/login");
    nextTick(() => {
      appStore.MyReset();
      examStore.MyReset();
      userStore.MyReset();
    });
  } else {
    ElNotification.error("退出失败！");
  }
};
