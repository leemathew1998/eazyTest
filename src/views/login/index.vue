<template>
  <div class="login-container h-full w-full">
    <div class="backgroudImage h-full w-full"></div>
    <div class="login-form h-full w-64">
      <span class="form-title">快捷方便、省时省力</span>
      <span class="form-name">在线考试系统</span>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-row :gutter="20" class="mb-3">
          <el-col :span="24" :offset="0">
            <el-form-item prop="username">
              <el-input class="animated username" v-model="ruleForm.username" type="username" autocomplete="off"
                placeholder="请输入用户名">
                <template #prefix>
                  <img src="@/assets/image/user.svg" alt="" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb-3">
          <el-col :span="24" :offset="0">
            <el-form-item prop="password">
              <el-input class="animated password" v-model="ruleForm.password" type="password" autocomplete="off"
                placeholder="请输入密码">
                <template #prefix>
                  <img src="@/assets/image/lock.svg" alt="" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb-3">
          <el-col :span="24" :offset="0">
            <el-form-item prop="code" class="animated">
              <el-input v-model="ruleForm.code" placeholder="请输入验证码" class="code-input animated code">
                <template #prefix>
                  <img src="@/assets/image/code.svg" alt="" />
                </template>
              </el-input>
              <div class="code-image h-max" @click="getCAPTCHA" v-loading="captchaLoading">
                <img :src="base64" alt="" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button class="submit-button w-full" @click="submitForm(ruleFormRef)" :loading="loading">登录</el-button>
        </el-form-item>
        <el-form-item class="flex justify-end">
          <a href="javascript:;" class="forgetThePassword" @click="forgetThePassword">忘记密码?</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { getCaptcha, pushLogin } from "@/api/user.js";
import { ruleForm, CryptojsSet, rules, addRoutes } from "./methods.js";
import { useUserStore, useAppStore, useExamStore } from "@/store";
const loading = ref(false);
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const examStore = useExamStore();
const ruleFormRef = ref();
onMounted(() => {
  //删除多余的router，
  router.hasRoute('main') && router.removeRoute("main");
  router.hasRoute('exam') && router.removeRoute("exam");
  getCAPTCHA();
  localStorage.clear();
  setTimeout(() => {
    appStore.MyReset();
    examStore.MyReset();
    userStore.MyReset();
  }, 300);
});
const submitForm = (formEl) => {
  //添加路由方法测试！
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      loginSubmit();
    } else {
      //验证失败需要抖动
      Object.keys(fields).forEach((className) => {
        const el = document.getElementsByClassName(className)[0]
        if (el.className.indexOf("shake") > -1) {
          el.classList.remove("shake");
        }
        setTimeout(() => {
          el.classList.add("shake");
        }, 0);
      });
      return false;
    }
  });
};
//登录
const loginSubmit = async () => {
  loading.value = true;
  const res = await pushLogin({
    username: ruleForm.username,
    password: CryptojsSet(ruleForm.password),
    code: ruleForm.code,
  });
  if (res.code === 200) {
    // 登录成功,密码加密以后再说
    userStore.username = ruleForm.username;
    userStore.password = CryptojsSet(ruleForm.password);
    userStore.userId = res.id;
    userStore.token = res.token;
    //添加路由
    await addRoutes();
  } else {
    getCAPTCHA();
    ruleForm.code = "";
    ElMessage.error(res.message);
  }
  loading.value = false;
};
//忘记密码
const forgetThePassword = () => {
  ElMessageBox.alert("请联系管理员重置密码", "忘记密码", {
    confirmButtonText: "确定",
  });
};

//验证码相关
const base64 = ref("");
const captchaLoading = ref(false);
const getCAPTCHA = async () => {
  captchaLoading.value = true;
  const res = await getCaptcha();
  if (res) {
    base64.value = `data:image/jpeg;base64,${res}`;
  }
  captchaLoading.value = false;
};
// 检测键盘
window.onkeydown = function (event) {
  if (event.keyCode == 13) {
    submitForm(ruleFormRef.value);
  }
};
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  position: relative;

  .backgroudImage {
    background: url("@/assets/image/loginBackgroud.png") 0 0;
    background-size: 100% 100%;
    // background: url("@/assets/image/temp-nav.png") 0 0;
    // background-size: auto;

  }

  .login-form {
    position: absolute;
    left: 65%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    //临时处理---------------
    // background-color: #ffffff;
    // margin: 10px;
    // padding: 30px 2px !important;
    // width: 20vw !important;
    // border-radius: 16px;
    // height: auto;
    // top: 30%;

    .form-title {
      font-family: "SourceHanSansCN-Light", "思源黑体 CN Light", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 200;
      font-style: normal;
      color: #31969a;
    }

    .form-name {
      font-family: "SourceHanSansCN-Bold", "思源黑体 CN Bold", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 30px;
      color: #31969a;
    }

    .code-input {
      flex: 3;
      width: 50% !important;

      /deep/.el-input__suffix-inner {
        display: none;
      }
    }

    .code-image {
      flex: 3;
      width: 5rem;

      img {
        padding-left: 10px;
        height: 100%;
      }
    }

    .submit-button {
      cursor: pointer;
      display: flex;
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 500;
      font-style: normal;
      font-size: 18px;
      padding: 10px;
      box-shadow: 4px 8px 5px rgb(49 150 154 / 20%);
      background: linear-gradient(180deg, rgba(14, 180, 159, 1) 0%, rgba(0, 134, 117, 1) 94%);
      color: #ffffff;
    }

    .forgetThePassword {
      text-align: end;
      justify-content: end;
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #31969a;
    }
  }
}

/deep/.el-form-item__content {
  margin-left: 0px !important;
  display: flex;
}

/deep/.el-input__inner {
  width: 6rem !important;
}
</style>
<style lang="less">
/deep/.el-message-box__btns {
  .el-button--primary {
    background-color: rgba(49, 150, 154, 1) !important;
  }
}

::v-deep(.el-button--primary) {
  background-color: rgba(49, 150, 154, 1) !important;
}
</style>
