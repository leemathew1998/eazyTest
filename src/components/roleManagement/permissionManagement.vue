<template>
  <el-dialog
    v-model="props.showPermissionModal"
    :title="props.userRecord ? '修改权限信息' : '新增权限'"
    width="40%"
    @closed="closeModal(ruleFormRef)"
  >
    <div v-loading="loading" class="loading">
      <el-tree
        :data="treeData"
        ref="treeRef"
        :props="{ children: 'children', label: 'label' }"
        node-key="id"
        accordion
        show-checkbox
        @check-change="handleNodeClick"
      />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="buttonLoading" class="animated">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { getPermissions, updateRoleMenuList } from "@/api/roleManagement.js";
import { useUserStore } from "@/store";
import { logoutAccount } from "@/components/basicLayout/methods.js";
import { ElMessage, ElNotification } from "element-plus";
const userStore = useUserStore();
// 状态参数
const props = defineProps({
  showPermissionModal: Boolean,
  permissionRoleId: String | Number,
});
const emit = defineEmits();
const closeModal = () => {
  emit("update:showPermissionModal", false);
};
//检测是否弹出，弹出后请求接口
watch(
  () => props.showPermissionModal,
  (newVal) => {
    if (newVal) {
      loadTreePremissions();
    }
  },
);
const treeData = reactive([]);
const loading = ref(false);
const menuList = reactive({
  value: [],
});
const loadTreePremissions = async () => {
  loading.value = true;
  while (treeData.length > 0) {
    treeData.pop();
  }
  const payload = {
    userId: userStore.userId,
    roleId: props.permissionRoleId,
  };
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
      //不能把父id选中！
      if (checkList.includes(item.menuId)) {
        checkList.splice(checkList.indexOf(item.menuId), 1);
      }
      //开始循环孩子
      if (item.children.length > 0) {
        walkChildren(temp_items, item.children, item.menuId);
      }
      treeData.push(temp_items);
    });
  }
  nextTick(() => {
    treeRef.value.setCheckedKeys(checkList, false);
    loading.value = false;
  });
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

// 处理树状全线
const handleNodeClick = (data, flag1, flag2) => {
  const allCheckedKeys = treeRef.value.getCheckedKeys(false, false);
  //点击了父级组件
  if (data.hasOwnProperty("children")) {
    //如果选择了data中的某一项，就得把其中的查询权限加上。
    //找到查询的id
    const result = data.children.find((thisItem) => {
      return thisItem.label === "查询";
    });
    //判断是否选中的key中有在此data中的
    const isFlag = data.children.find((item) => {
      return allCheckedKeys.includes(item.id);
    });
    //如果此data中有别的选中了，但是查询没选择，就需要选上！
    if (!allCheckedKeys.includes(result.id) && isFlag) {
      treeRef.value.setCheckedKeys([...allCheckedKeys, result.id], false);
    }
  } else {
    //点击了内部的组件，点击了查询按钮希望关闭查询，此时需要看看是否此data中还有别的选项选中。没有可以关闭，有的话不能关闭
    if (data.label === "查询" && !flag1) {
      const selectMenu = menuList.value.find((item) => item.menuId === data.fatherId);
      const flag = selectMenu.children.find((item) => {
        return allCheckedKeys.includes(item.menuId);
      });
      if (flag) {
        treeRef.value.setCheckedKeys([...allCheckedKeys, data.id], false);
      }
    }
  }
};
const treeRef = ref();
const buttonLoading = ref();
// form数据
const submitForm = async () => {
  buttonLoading.value = true;
  const payload = {
    roleId: props.permissionRoleId,
    //没有数据就是空字符串
    list: [...treeRef.value.getCheckedKeys(false, false), ...treeRef.value.getHalfCheckedKeys()],
  };
  const res = await updateRoleMenuList(payload);
  if (res.code === 200 && res.success) {
    ElMessage.success("修改成功！");
    if (props.permissionRoleId == userStore.roleId) {
      //修改的是自己的权限，需要重新进入
      ElNotification.warning("权限已修改，请重新登录！");
      logoutAccount();
    }
    emit("reLoadData", true);
    closeModal();
  } else {
    ElMessage.error("修改失败");
  }
  buttonLoading.value = false;
};
</script>
<style lang="less" scoped>
/deep/.el-form-item__content {
  width: 16rem !important;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-input__validateIcon {
  display: none;
}
</style>
