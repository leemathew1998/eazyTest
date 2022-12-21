// 实现自定义指令v-checkRole
// 用于判断当前用户是否有权限访问该页面
import { useUserStore } from "@/store";
const userStore = useUserStore();
const checkRole = (el, binding) => {
  const [first, last] = binding.value.split("-");
  if (!userStore.menuLicenses[first]?.includes(last)) {
    //说明没有权限，需要卸载掉该组件
    el?.parentNode?.removeChild(el);
  }
};

export default checkRole;
