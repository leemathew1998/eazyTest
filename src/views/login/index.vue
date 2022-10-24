<template>
  <div class="login-container h-full w-full">
    <div class="backgroudImage h-full w-full"></div>
    <div class="login-form h-full w-64">
      <span class="form-title">快捷方便、省时省力</span>
      <span class="form-name">在线考试系统</span>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="ruleForm.username"
            type="username"
            autocomplete="off"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <img src="@/assets/image/user.svg" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          >
            <template #prefix>
              <img src="@/assets/image/lock.svg" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input
            v-model.number="ruleForm.code"
            placeholder="请输入验证码"
            class="code-input"
          >
            <template #prefix>
              <img src="@/assets/image/code.svg" alt="" />
            </template>
          </el-input>
          <div class="code-image h-max">
            <img src="@/assets/image/code-image.png" alt="" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submit-button w-full"
            @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <a href="" class="forgetThePassword w-full">忘记密码?</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const ruleFormRef = ref();
const submitForm = (formEl) => {
  console.log(router);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
        router.push('/')
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
// 验证函数
/*
 *@Author: jkwei
 *@Date: 2022-10-24 18:53:36
 *@Description: 以下都是验证函数
 */

const usernameValidate = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入用户名!"));
  } else {
    callback();
  }
};
const passwordValidate = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码!"));
  } else {
    callback();
  }
};

const codeValidate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入验证码!"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入验证码!"));
    } else {
      if (value < 18) {
        callback(new Error("验证码错误！"));
      } else {
        callback();
      }
    }
  }, 1000);
};

const ruleForm = reactive({
  username: "",
  password: "",
  code: "",
});

const rules = reactive({
  username: [{ validator: usernameValidate, trigger: "blur" }],
  password: [{ validator: passwordValidate, trigger: "blur" }],
  code: [{ validator: codeValidate, trigger: "change" }],
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  position: relative;
  .backgroudImage {
    background: url("@/assets/image/loginBackgroud.png") 0 0;
    background-size: auto;
    background-size: 100% 100%;
  }
  .login-form {
    position: absolute;
    left: 65%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .form-title {
      font-family: "SourceHanSansCN-Light", "思源黑体 CN Light",
        "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 200;
      font-style: normal;
      color: #31969a;
    }
    .form-name {
      font-family: "SourceHanSansCN-Bold", "思源黑体 CN Bold",
        "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 30px;
      color: #31969a;
    }
    .code-input {
      flex: 3;
    }
    .code-image {
      flex: 2;
      img {
        padding-left: 10px;
        height: 100%;
      }
    }
    .submit-button {
      cursor: pointer;
      display: flex;
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium",
        "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-weight: 500;
      font-style: normal;
      font-size: 18px;
      padding: 10px;
      box-shadow: 4px 8px 5px rgb(49 150 154 / 20%);
      background: linear-gradient(
        180deg,
        rgba(14, 180, 159, 1) 0%,
        rgba(0, 134, 117, 1) 94%
      );
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
</style>
