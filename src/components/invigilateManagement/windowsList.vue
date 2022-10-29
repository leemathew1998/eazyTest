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
  display: flex;
  min-height: 70vh;
  max-height: 100vh;
  overflow-y: scroll;
  margin-top: 0.5rem;
  .left {
    flex: 3;
    // height: 100%;
    display: flex;
    flex-direction: column;

    .WatchList {
      flex: 3;
      margin-bottom: 0.5rem;
    }
    .UserAnswersObserve {
      flex: 2;
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
