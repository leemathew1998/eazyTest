<template>
  <div class="loop-container-monitor" ref="container" v-loading="loading">
    <div v-for="(item, index) in monitorList.value" :key="index" class="item-exam">
      <!-- 左上角 -->
      <p class="absolute top-0 left-0 mark" v-if="item.examType === '1'">在线</p>
      <img src="@/assets/image/u728.svg" alt="" class="absolute -top-px left-0" v-if="item.examType === '1'" />
      <!-- 右上角 -->
      <el-popconfirm title="确定要删除此场考试吗？" :teleported="true" @confirm.stop="deleteExam(item)">
        <template #reference>
          <el-icon class="absolute top-2 right-2 cursor-pointer" color="#999"><CloseBold /></el-icon>
        </template>
      </el-popconfirm>

      <div class="relative mb-4">
        <img src="@/assets/image/u57.svg" alt="" />
        <img class="move-image" src="@/assets/image/u58.svg" alt="" />
      </div>
      <span class="item-title">{{ item.examName }}</span>
      <span class="item-describe">{{ solveDateRange(item) }}</span>
      <span class="item-describe">时长:{{ item.examLongTime }}分钟</span>
      <el-button
        :class="[item.examStatus !== '2' ? 'grayColor' : '']"
        plain
        @click="enterMonitor"
        :disabled="item.examStatus !== '2'"
        >{{ solveButtonWord(item) }}</el-button
      >
    </div>
    <!--高度问题，未解决 -->
    <div class="h-24 w-full"></div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { getList, deleteOneExam } from "@/api/invigilateManagement.js";
import dayjs from "dayjs";
import loadsh from "lodash";
import { ElMessage } from "element-plus";
const container = ref(null);
//加载数据
const params = ref({
  pageNo: 1,
  pageSize: 30,
  total: 0,
});
const loading = ref(false);
//2代表可以监考，最大的值
const mapStatus = {
  1: 2,
  2: 3,
  3: 1,
};
const loadData = async () => {
  loading.value = true;
  const res = await getList(params.value);
  if (res.code === 200) {
    params.value.total = res.data.total;
    //排序规则，时间>考试中->未开始->已结束
    res.data.records.sort((prev, next) => {
      return dayjs(next.examBeginTime).valueOf() - dayjs(prev.examBeginTime).valueOf();
    });
    res.data.records.sort((prev, next) => {
      return mapStatus[next.examStatus] - mapStatus[prev.examStatus];
    });
    monitorList.value.push(...res.data.records);
  }
  // solveMargin();
  loading.value = false;
};
//检测是不是滑到最底下了
const handlerHeight = () => {
  const scrollTop = document.getElementsByClassName("loop-container-monitor")[0].scrollTop;
  const clientHeight = document.getElementsByClassName("loop-container-monitor")[0].clientHeight;
  const scrollHeight = document.getElementsByClassName("loop-container-monitor")[0].scrollHeight;
  if (scrollTop + clientHeight === scrollHeight) {
    if (params.value.pageNo * params.value.pageSize < params.value.total) {
      console.log("滑到最低了，加载数据");
      params.value.pageNo++;
      loadData();
    }
  }
};
onMounted(() => {
  monitorList.value = [];
  loadData();
  window.addEventListener("scroll", loadsh.throttle(handlerHeight, 300));
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handlerHeight);
});

//处理时间
const solveDateRange = (record) => {
  return `${dayjs(record.examBeginTime).format("M月D日")} ${dayjs(record.examBeginTime).format("HH:mm:ss")}至${dayjs(
    record.examEndTime,
  ).format("HH:mm:ss")}`;
};
//处理下面的按钮文字
const solveButtonWord = (record) => {
  return record.examStatus === "1" ? "暂未开始" : record.examStatus === "2" ? "开始监考" : "已结束";
};
//删除考试
const deleteExam = async (record) => {
  console.log(record, container.value);

  const res = await deleteOneExam(record.examId);
  if (res.code === 200) {
    ElMessage.success("删除成功！");
    params.value.pageNo = 1;
    container.value.scrollTop = 0;
    loadData();
  } else {
    ElMessage.error("删除失败！");
  }
};

//解决宽度问题
const solveMargin = () => {
  /*
   *@Author: jkwei
   *@Date: 2022-11-02 09:44:59
   *@Description: 既要兼顾每一行，还要兼顾整体
   */
  if (monitorList.value.length > 0) {
    //总体宽度
    const containerWidth = container.value.clientWidth;
    //每一个元素宽度
    console.log(document.getElementsByName("item-exam"));
    const items = document.getElementsByClassName("item-exam");
    const itemWidth = items[0].clientWidth;
    //一行有多少个
    const rowCount = Math.floor(containerWidth / itemWidth);
    //剩余了多少px
    let leftWidth = containerWidth - itemWidth * rowCount;
    // 每一个margin是多少
    const oneItemMargin = leftWidth / (rowCount - 1);
    items.forEach((item, index) => {
      if ((index + 1) % 2 === 0) {
        //中间的那些，左右都要margin
        if ((index + 1) % rowCount === 0) {
          items[index].style.margin = `0.5rem 0px 0px ${oneItemMargin - 3}px `;
        } else {
          //每行中最后一个
          items[index].style.margin = `0.5rem ${oneItemMargin - 3}px 0px ${oneItemMargin - 3}px `;
        }
      }
    });
  }
};
const enterMonitor = () => {};
const monitorList = reactive({ value: [] });
</script>
<style lang="less" scoped>
.grayColor {
  background-color: #999 !important;
}
.mark {
  transform: rotate(-45deg);
  font-size: 12px;
  color: rgb(244, 234, 234);
  z-index: 10;
  position: absolute;
  top: 4px;
}
.loop-container-monitor {
  min-height: 70vh;
  max-height: 100vh;
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 2em;
  .item-exam {
    position: relative;
    margin-right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    background-color: rgba(49, 150, 154, 0.101960784313725);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(49, 150, 154, 1);
    border-radius: 3px;
    margin-top: 0.5rem;
    width: 13rem;
    min-height: 15rem;

    .move-image {
      position: absolute;
      top: 12px;
      left: 8px;
    }
    .item-title {
      font-family: "SourceHanSansCN-Medium", "思源黑体 CN Medium", "思源黑体 CN Normal", "思源黑体 CN", sans-serif;
      font-style: normal;
      font-size: 16px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .item-describe {
      white-space: nowrap;
      font-family: "SourceHanSansCN-Regular", "思源黑体 CN", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
    }
    span {
      margin-bottom: 16px;
    }
    /deep/.el-button {
      background-color: #32969a;
      color: #fff;
      border-radius: 16px;
    }
  }
}
</style>
