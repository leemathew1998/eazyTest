<template>
  <BlankCardVue>
    <template #mainContent>
      <div class="flex justify-between items-center">
        <span class="title">2022年10月前端技术考试一</span>
        <div class="flex">
          <el-button type="primary" v-if="props.returnPath !== '/reviewManagement'" @click="submit">
            <el-icon class="mr-2"><Select /></el-icon>交卷
          </el-button>
          <el-button @click="exit"> <img src="@/assets/image/u3164.svg" class="pr-2" />退出 </el-button>
        </div>
      </div>
    </template>
  </BlankCardVue>
</template>
<script setup>
import BlankCardVue from "@/components/blankCard.vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
// 此页面是公共组件，returnPath是/reviewManagement的是阅卷中的，其他的是考试中的。
const props = defineProps({
  returnPath: String,
});
const exit = () => {
  if (props.returnPath === "/reviewManagement") {
    router.push(props.returnPath);
  } else {
    ElMessageBox.confirm("您确定要退出吗？将会提交您的答题记录", "中途退出", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then((action) => {
      if (action === "confirm") {
        console.log(action);
      }
    });
  }
};
const submit = () => {
  ElMessageBox.confirm("您确定要交卷吗？还有1道题未答", "交卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then((action) => {
    if (action === "confirm") {
      console.log(action);
    }
  });
};
</script>
<style lang="less" scoped>
.title {
  font-family: "思源黑体 CN", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #31969a;
}
:deep(.el-button) {
  border-width: 0px;
  display: flex;
  font-family: "思源黑体 CN Normal", "思源黑体 CN Regular", "思源黑体 CN", sans-serif;
  font-weight: 350;
  font-style: normal;
  font-size: 14px;
  color: #333333;
  background-color: rgba(0, 121, 106, 0);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(217, 217, 217, 1);
  border-radius: 6px;
  padding: 0 1.5em;
}
/deep/.el-button--primary {
  background-color: rgba(49, 150, 154, 1);
  color: #fff;
}
</style>
