<template>
  <BlankCard>
    <template #mainContent>
      <div class="loop-container-watch" ref="container">
        <swiper
          :modules="modules"
          :loop="true"
          :slides-per-view="1"
          :space-between="50"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :style="{ width: `${swiperWidth}px` }"
        >
          <!-- 每页两个，自动循环 -->
          <swiper-slide v-for="(page, index) in Math.ceil(watchList.length / 2)">
            <div class="swiper-page">
              <div ref="items" class="item-container">
                <img src="@/assets/image/u1445.png" alt="" class="item-image" />
                <!-- <video :id="item.username" class="item-image" autoplay playsinline></video> -->
                <div class="item-bottom">
                  <span class="item-bottom-name">{{ watchList[index * 2].username }}</span>
                  <el-button @click="">查 看</el-button>
                </div>
              </div>
              <div ref="items" class="item-container" v-if="index * 2 + 1 < watchList.length">
                <img src="@/assets/image/u1445.png" alt="" class="item-image" />
                <!-- <video :id="item.username" class="item-image" autoplay playsinline></video> -->
                <div class="item-bottom">
                  <span class="item-bottom-name">{{ watchList[index * 2 + 1].username }}</span>
                  <el-button @click="">查 看</el-button>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </template>
  </BlankCard>
</template>
<script setup>
import { reactive, watch, ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination"; // 轮播图底面的小圆点
import "swiper/css/navigation"; // 轮播图两边的左右箭头
import "swiper/css/scrollbar"; // 轮播图的滚动条
// 引入swiper核心和所需模块
import { Autoplay, Pagination, Navigation, Scrollbar } from "swiper";
import BlankCard from "@/components/blankCardHFull.vue";
import { register, call } from "@/components/onExam/methods.js";
const modules = [Autoplay, Pagination, Navigation, Scrollbar];
const container = ref(null);
const swiperWidth = ref(200);
onMounted(() => {
  swiperWidth.value = container.value.clientWidth;
  register("manage");
  setTimeout(() => {
    call();
  }, 1000);
});
/*
 *@Author: jkwei
 *@Date: 2022-10-25 10:38:47
 *@Description: fack list
 */
const watchList = reactive([]);
for (let i = 0; i < 51; i++) {
  watchList.push({
    streamId: Math.random() * 100,
    username: Math.floor(Math.random() * 100),
  });
}
</script>
<style lang="less" scoped>
.loop-container-watch {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .swiper-page {
    display: flex;
    justify-content: space-evenly;
    height: 100%;
    width: 100%;
    .item-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      justify-content: center;
      .item-image {
        min-width: 15rem;
        max-width: 18rem;
      }
      .item-bottom {
        min-width: 15rem;
        max-width: 18rem;
        left: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 1);
        padding: 4px 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .item-bottom-name {
        font-family: "思源黑体 CN", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}
/deep/.el-button {
  height: 24px;
  border: none;
  background-color: #fff;
  border-radius: 16px;
  color: #000;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
}
</style>
