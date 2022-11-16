<template>
  <el-dialog
    v-model="props.startFullscreen"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="线上笔试注意事项"
    width="50%"
  >
    <div class="readMe-container">
      <el-card shadow="never" class="card-inner">
        <span
          >1.本次考试设有<span style="color: red">视频音频实时监控</span
          >，请使用带有摄像头、麦克风和扬声器的笔记本或台式电脑（不能使用手机作答）。为确保笔试系统稳定，请使用Google
          Chrome浏览器作答。</span
        >
        <el-divider />
        <span
          >2.本次考试使用视频监控，对考生网速要求较高，如果作答过程中，系统提示“当前网络异常无法达到考试要求...”，建议您将及时调整网络。</span
        >
        <el-divider />
        <span
          >3.笔试过程中严禁使用计算器，严禁使用草稿纸。严禁抄录、拍摄、录屏、传播试题，严禁查阅资料、书籍、手机等搜索答案，严禁询问他人等所有作弊及协助作弊情形。</span
        >
        <el-divider />
        <span> 4.笔试过程中严禁离开电脑及手机视频监控范围，严禁退出笔试作答页面，严禁恶意切断监控设备。 </span>
        <el-divider />
        <span>
          5.对于考生考试过程中的严重不当行为，导致试题泄露或给南瑞集团带来重大损失的，我方保留追究其法律责任的权利。
        </span>
        <el-divider />
        <span>6.考生因自身原因（如设备、网络问题、未进行试考等）造成笔试不能正常进行的，后果由考生自己承担。</span>
        <el-divider />
        <span>7.笔试开始时系统将自动开启倒计时，笔试结束时系统将自动执行交卷。</span>
        <el-divider />
        <span
          >8.考生笔试环境应为安静、独立的空间，避免在网吧、咖啡厅、办公室等公共场所进行笔试，避免除考生外其他人员进入监控画面。</span
        >
        <el-divider />
        <span
          >9.笔试过程中不允许佩戴耳机，请确保监控画面中头发不要遮挡住耳朵。笔试过程中考生不允许吸烟、吃东西等与笔试无关的行为。</span
        >
        <el-divider />
        <span>10.笔试前请考生准备好备用笔试设备及网络热点，以便在考中设备或网络故障时可以及时更换。</span>
      </el-card>
    </div>
    <el-checkbox v-model="isUserAgree" :disabled="isReadFinish">我已充分阅读并理解所有条款,同意开始考试</el-checkbox>
    <template #footer>
      <span class="dialog-footer flex justify-end">
        <el-button style="background-color: red" type="primary" @click="agree" :disabled="isReadFinish"
          >开始考试</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { Fullscreen } from "@/utils/antiCheatingMethod.js";
import { ElMessage } from "element-plus";
import { ref } from "vue";
const isReadFinish = ref(true);
const isUserAgree = ref(false);
const props = defineProps({
  startFullscreen: Boolean,
});
const emits = defineEmits();
//检测是不是滑到最底下了
window.addEventListener(
  "scroll",
  () => {
    const scrollTop = document.getElementsByClassName("card-inner")[0]?.scrollTop;
    const clientHeight = document.getElementsByClassName("card-inner")[0]?.clientHeight;
    const scrollHeight = document.getElementsByClassName("card-inner")[0]?.scrollHeight;
    if (scrollTop + clientHeight > scrollHeight - 100) {
      isReadFinish.value = false;
    }
  },
  true,
);

const agree = async () => {
  if (isUserAgree.value) {
    emits("update:startFullscreen", false);
    setTimeout(() => {
      Fullscreen();
    }, 500);
  } else {
    ElMessage.warning("请勾选选项后开始答题！");
    return;
  }
};
</script>
<style lang="less" scoped>
// @import url("@/assets/css/common.less");
.readMe-container {
  height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .card-inner {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    overflow: scroll;
  }
}
/deep/.el-divider--horizontal {
  margin: 8px 0px;
}
</style>
