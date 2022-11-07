<template>
  <div v-loading="loading">
    <el-dialog
      v-model="props.showPermissionModal"
      :title="props.userRecord ? '修改权限信息' : '新增权限'"
      width="50%"
      @closed="closeModal(ruleFormRef)"
    >
      <el-tree
        :data="treeData"
        ref="treeRef"
        node-key="menuId"
        accordion
        show-checkbox
        @check-change="handleNodeClick"
      />
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="closeModal">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
// import { treeData } from "./constants.js";
import { getPermissions } from "@/api/roleManagement.js";
import { useUserStore } from "@/store";
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
const loadTreePremissions = async () => {
  const setCheckedNodes = [];
  loading.value = true;
  while (treeData.length > 0) {
    treeData.pop();
  }
  const payload = {
    userId: userStore.userId,
    roleId: props.permissionRoleId,
  };
  const res = await getPermissions(payload);
  if (res.code === 200) {
    const menuList = res.data.menuList;
    const checkList = res.data.checkList;
    // 开始递归
    menuList.forEach((item) => {
      //主items
      const temp_items = {
        label: item.name,
        menuId: item.menuId,
      };
      //开始循环孩子
      if (item.children.length > 0) {
        walkChildren(temp_items, item.children, checkList);
      }
      treeData.push(temp_items);
    });
  }
  treeRef.value.setCheckedNodes(setCheckedNodes, false);
  loading.value = false;
  console.log(treeData, setCheckedNodes);
};
const walkChildren = (menu, childrens, checkList) => {
  menu.children = [];
  childrens.forEach((item) => {
    if (checkList.includes(item.menuId)) {
      setCheckedNodes.push({
        label: item.name,
        menuId: item.menuId,
      });
    }
    menu.children.push({
      label: item.name,
      menuId: item.menuId,
    });
  });
};

// 处理树状全线
const handleNodeClick = (data) => {
  if (data.hasOwnProperty("children")) {
    //如果选择了data中的某一项，就得把其中的查询权限加上。
    const allCheckedNodes = treeRef.value.getCheckedNodes(false, false); //[...]
    const result = data.children.find((thisItem) => {
      const abc = allCheckedNodes.find((checkedNode) => {
        return checkedNode.label === thisItem.label;
      });
      return abc ? true : false;
    });
    console.log(`allCheckedNodes,result`, allCheckedNodes, result);
    if (result) {
      treeRef.value.setCheckedNodes([data.children[0], ...allCheckedNodes], false);
    } else {
      // 没找到
    }
  }
};
const treeRef = ref();
// form数据
const submitForm = async () => {};
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
