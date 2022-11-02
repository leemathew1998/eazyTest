<template>
  <div class="windowsList-container">
    <div class="left">
      <WatchList class="WatchList"></WatchList>
      <UserAnswersObserve class="UserAnswersObserve"></UserAnswersObserve>
    </div>
    <div class="right">
      <div class="CountDownTime">
        <CountDownTime></CountDownTime>
      </div>
      <div class="ExceptionList">
        <ExceptionList></ExceptionList>
      </div>
    </div>
  </div>
</template>
<script setup>
import WatchList from "./windowsListComponents/watchList.vue";
import UserAnswersObserve from "./windowsListComponents/userAnswersobserve.vue";
import CountDownTime from "./windowsListComponents/countDownTime.vue";
import ExceptionList from "./windowsListComponents/exceptionList.vue";
</script>
<style lang="less" scoped>
.windowsList-container {
  // background-color: #f4f4f4;
  // padding: 0.5rem;
  display: flex;
  height: 100%;
  min-height: 70vh;
  max-height: 100vh;
  margin-bottom: -1rem;
  // overflow-y: scroll;
  .left {
    flex: 3;
    // height: 100%;
    display: flex;
    flex-direction: column;

    .WatchList {
      flex: 2;
      margin-bottom: 0.5rem;
    }
    .UserAnswersObserve {
      flex: 3;
    }
  }
  .right {
    flex: 1;
    margin-left: 0.5rem;
    display: flex;
    flex-direction: column;
    .CountDownTime {
      flex: 1;
    }
    .ExceptionList {
      flex: 5;
      margin-top: 0.5rem;
    }
  }
}
</style>
