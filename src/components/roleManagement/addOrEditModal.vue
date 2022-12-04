<template>
  <el-dialog v-model="showUserModal" :title="props.roleRecord ? '修改角色信息' : '新增角色'" width="40%"
    @closed="closeModal(ruleFormRef)">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" status-icon
      v-loading="formLoading" element-loading-text="加载中...">
      <el-row :gutter="20">
        <el-col :span="userStore.menuLicenses['角色管理']?.includes('分配角色') ? 12 : 24" :offset="0">
          <el-row :gutter="20" justify="center" class="mb-4">
            <el-form-item label="角色名称" prop="rolename">
              <el-input v-model="ruleForm.rolename" placeholder="请输入角色名称" :disabled="props.readOnly" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20" justify="center">
            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入角色描述" :disabled="props.readOnly" />
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12" :offset="0" v-if="userStore.menuLicenses['角色管理']?.includes('分配角色')">
          <div>
            <el-tree :data="treeData.value" ref="treeRef" :props="{ children: 'children', label: 'label' }"
              node-key="id" accordion show-checkbox @check-change="handleNodeClick" />
          </div>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="closeModal(ruleFormRef)">取消</el-button>
        <el-button :loading="loading" v-if="!props.readOnly" type="primary" ref="buttonRef" class="animated"
          @click="submitForm(ruleFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from "vue";
import { modalRules } from "./constants.js";
import { addRole, updateRole } from "@/api/roleManagement.js";
import { ElMessage, ElNotification } from "element-plus";
import { useUserStore } from "@/store";
import { formLoading, treeData, loadTreePremissions, menuList, saveRoleMenuList } from "./methods.js";
import dayjs from "dayjs";
const userStore = useUserStore();
// 状态参数
const props = defineProps({
  showUserModal: Boolean,
  roleRecord: Object,
  readOnly: Boolean,
});
const emit = defineEmits();
const closeModal = (formEl) => {
  emit("update:showUserModal", false);
  setTimeout(() => {
    emit("update:roleRecord", {});
    formEl.resetFields();
  }, 300);
};
//treeRef
const treeRef = ref();
let checkList = [];
watch(
  () => props.showUserModal,
  async (newVal) => {
    if (newVal && props.roleRecord) {
      checkList = await loadTreePremissions({
        userId: userStore.userId,
        roleId: props?.roleRecord?.roleId || null,
      });
      nextTick(() => {
        ruleForm.rolename = props.roleRecord.roleName;
        ruleForm.description = props.roleRecord.description;
        ruleForm.createBy = props.roleRecord.createBy;
        ruleForm.createTime = props.roleRecord.createTime;
        ruleForm.updateBy = props.roleRecord.updateBy;
        ruleForm.updateTime = props.roleRecord.updateTime;
        // 选中已有权限
        treeRef.value.setCheckedKeys(checkList, false);
        formLoading.value = false;
      });
    } else if (newVal) {
      // 新增,为了展示出来tree，可以使用自己的roleId,只是不需要赋值即可
      await loadTreePremissions({
        userId: userStore.userId,
        roleId: userStore.roleId,
      });
      nextTick(() => {
        treeRef.value.setCheckedKeys([], false);
        formLoading.value = false;
      });
    }
  },
);
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
    //再多处理一下，如果这个上有分配角色、分配权限，那如果点击新增了，就需要把响应的权限也加上，
    //因为后端认为新增是新增，分配是分配，但是前端已经合并在一起了
    const hasDispathRole = data.children.find((thisItem) => {
      return thisItem.label.includes("分配");
    });
    const hasAddRole = data.children.find((thisItem) => {
      return thisItem.label.includes("新增");
    });
    //判断是否选中的key中有在此data中的
    const isFlag = data.children.find((item) => {
      return allCheckedKeys.includes(item.id);
    });
    if (hasDispathRole && allCheckedKeys.includes(hasAddRole.id) && !allCheckedKeys.includes(hasDispathRole.id)) {
      allCheckedKeys.push(hasDispathRole.id);
    }

    //如果此data中有别的选中了，但是查询没选择，就需要选上！
    if (!allCheckedKeys.includes(result.id) && isFlag) {
      allCheckedKeys.push(result.id);
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
    if (data.label.includes('分配') || data.label === '新增') {
      if (flag1) {
        //选中
        if (data.label === '新增') {
          const hasDispathRole = treeData.value.find((thisItem) => thisItem.id === data.fatherId).children.find((thisItem) => {
            return thisItem.label.includes("分配");
          });
          hasDispathRole && !allCheckedKeys.includes(hasDispathRole.id) && allCheckedKeys.push(hasDispathRole.id)
        } else {
          const hasAddRole = treeData.value.find((thisItem) => thisItem.id === data.fatherId).children.find((thisItem) => {
            return thisItem.label.includes("新增");
          });
          hasAddRole && !allCheckedKeys.includes(hasAddRole.id) && allCheckedKeys.push(hasAddRole.id)
        }
      } else {
        //取消选中
        if (data.label.includes('分配')) {
          const hasAddRole = treeData.value.find((thisItem) => thisItem.id === data.fatherId).children.find((thisItem) => {
            return thisItem.label.includes("新增");
          });
          hasAddRole && allCheckedKeys.includes(hasAddRole.id) && allCheckedKeys.splice(allCheckedKeys.indexOf(hasAddRole.id), 1)
        } else {
          const hasDispathRole = treeData.value.find((thisItem) => thisItem.id === data.fatherId).children.find((thisItem) => {
            return thisItem.label.includes("分配");
          });
          hasDispathRole && allCheckedKeys.includes(hasDispathRole.id) && allCheckedKeys.splice(allCheckedKeys.indexOf(hasDispathRole.id), 1)
        }
      }
    }
  }
  treeRef.value.setCheckedKeys(allCheckedKeys, false);
};
// form数据
const ruleFormRef = ref();
const ruleForm = reactive({
  rolename: "",
  description: "",
});
const rules = reactive(modalRules);
const loading = ref(false);
const buttonRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      let payload = {
        roleName: ruleForm.rolename,
        description: ruleForm.description,
      };
      let res;
      if (props.roleRecord) {
        payload = {
          ...payload,
          roleId: props.roleRecord.roleId,
          updateBy: userStore.username,
          updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        res = await updateRole(payload);
      } else {
        payload = {
          ...payload,
          createBy: userStore.username,
          createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        res = await addRole(payload);
      }
      //此时需要注意，我们合并了权限模块，所以此处还需要更新权限·
      let flag = true
      if (userStore.menuLicenses["角色管理"]?.includes('分配角色')) {
        const solveRole = await saveRoleMenuList({
          ...payload,
          userId: userStore.userId,
          roleId: props?.roleRecord?.roleId,
          list: [...treeRef.value.getCheckedKeys(false, false), ...treeRef.value.getHalfCheckedKeys()],
        });
        if (solveRole.code !== 200) {
          flag = false
          ElNotification({
            title: "分配角色失败",
            type: "error",
          });
        }
      }
      if (res.code === 200 && flag) {
        ElMessage.success(props.roleRecord ? "修改成功" : "新建成功！");
      } else {
        ElMessage.error(props.roleRecord ? "修改失败！" : "新增失败");
      }
      emit("reLoadData", true);
      closeModal(ruleFormRef.value);
    } else {
      if (buttonRef.value.ref.className.indexOf("shake") > -1) {
        buttonRef.value.ref.classList.remove("shake");
      }
      setTimeout(() => {
        buttonRef.value.ref.classList.add("shake");
      }, 0);
    }
    loading.value = false;
  });
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/animate.css");
/deep/.el-select {
  width: 100%;
}

/deep/.el-input__validateIcon {
  display: none;
}
</style>
