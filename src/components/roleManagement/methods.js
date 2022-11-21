import { ref, reactive } from "vue";
import { getPermissions, updateRoleMenuList, getList } from "@/api/roleManagement.js";
export const formLoading = ref(false);
export const treeData = reactive({ value: [] });
export const menuList = reactive({
  value: [],
});

export const loadTreePremissions = async (payload) => {
  formLoading.value = true;
  treeData.value = [];
  const res = await getPermissions(payload);
  let checkList;
  if (res.code === 200) {
    menuList.value = res.data.menuList;
    checkList = res.data.checkList;
    // 开始递归
    menuList.value.forEach((item) => {
      //主items
      const temp_items = {
        label: item.name,
        id: item.menuId,
      };
      //不能把父id选中！但是个人管理和首页除外！
      if (checkList.includes(item.menuId) && item.name !== "个人管理" && item.name !== "首页") {
        checkList.splice(checkList.indexOf(item.menuId), 1);
      }
      //开始循环孩子
      if (item.children.length > 0) {
        walkChildren(temp_items, item.children, item.menuId);
      }
      treeData.value.push(temp_items);
    });
  }
  return checkList;
};
const walkChildren = (menu, childrens, fatherId) => {
  menu.children = [];
  childrens.forEach((item) => {
    menu.children.push({
      fatherId: fatherId,
      label: item.name,
      id: item.menuId,
    });
  });
};

export const saveRoleMenuList = async (payload) => {
  if (typeof payload.roleId === "undefined") {
    // 需要先查出来roleId
    const findRoleId = await getList({ pageNo: 1, pageSize: 1, roleName: payload.roleName, userId: payload.userId });
    if (findRoleId.code === 200 && findRoleId.success) {
      payload.roleId = findRoleId.data.records[0].roleId;
    }
  }
  return updateRoleMenuList({
    roleId: payload.roleId,
    list: payload.list,
  });
};
