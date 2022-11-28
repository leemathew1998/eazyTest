<template>
  <BlankCardVue>
    <template #mainContent>
      <div class="flex justify-between items-center">
        <span class="title">{{ examStore.examName }}</span>
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
import { ElMessageBox, ElNotification } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useExamStore, useUserStore } from "@/store";
import { updateCodingScore, updateExamStatus } from "@/api/examBankManagement.js";
import emiter from "@/utils/mitt.js";
import { runCode, handlerAnswersAll } from "./methods.js";
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const examStore = useExamStore();
// 此页面是公共组件，returnPath是/reviewManagement的是阅卷中的，其他的是考试中的。
const props = defineProps({
  returnPath: String,
  questions: Object | Array,
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
        handlerAnswersAll(props.questions.value, true)
        updateIsTrue();
        emiter.emit("submit-exam", true);
        router.push(props.returnPath);
      }
    });
  }
};
const submit = () => {
  ElMessageBox.confirm("您确定要交卷吗?", "交卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then((action) => {
    if (action === "confirm") {
      handlerAnswersAll(props.questions.value, true)
      updateIsTrue();
      emiter.emit("submit-exam", true);
      router.push(props.returnPath);
    }
  });
};
const updateIsTrue = async () => {
  //更新考试状态为已完成，不能再次进入了
  const res = await updateExamStatus({
    examId: examStore.examId,
    userId: userStore.userId,
  })
  if (res.code !== 200) {
    ElNotification.error({
      title: "错误",
      message: res.message,
    });
  }
}
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
