<template>
  <div class="flex" v-loading="loading">
    <div class="left flex flex-col">
      <el-row :gutter="20" class="mb-2">
        <el-col :span="4" :offset="0" class="m-auto">
          <span class="whitespace-nowrap">题量:</span></el-col
        >
        <el-col :span="20" :offset="0">
          <el-slider v-model="props.autoRenderForm.count"
        /></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="0" class="m-auto">
          <span class="whitespace-nowrap">难度系数:</span></el-col
        >
        <el-col :span="20" :offset="0">
          <el-slider
            v-model="props.autoRenderForm.level"
            :format-tooltip="formatTooltip"
        /></el-col>
      </el-row>
      <el-row :gutter="20" class="mb-2">
        <el-col :span="4" :offset="0" class="m-auto">
          <span class="whitespace-nowrap">总分:</span></el-col
        >
        <el-col :span="20" :offset="0">
          <el-input
            placeholder="请输入总分"
            type="number"
            v-model="props.autoRenderForm.totalScore"
          >
            <template #append>分</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-2">
        <el-col :span="4" :offset="0" class="m-auto">
          <span class="whitespace-nowrap">题型:</span></el-col
        >
        <el-col :span="20" :offset="0">
          <el-select
            multiple
            placeholder="请选择题型"
            v-model="props.autoRenderForm.quesTypes"
          >
            <el-option label="单选题" value="单选题" />
            <el-option label="多选题" value="多选题" />
            <el-option label="简答题" value="简答题" />
            <el-option label="判断题" value="判断题" />
            <el-option label="编程题" value="编程题" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb-2">
        <el-col :span="4" :offset="0" class="m-auto">
          <span class="whitespace-nowrap">知识分类:</span></el-col
        >
        <el-col :span="20" :offset="0">
          <el-select
            multiple
            placeholder="请选择分类"
            v-model="props.autoRenderForm.class"
          >
            <el-option label="开发相关" value="开发相关" />
            <el-option label="算法题" value="算法题" />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!-- 右面数据内容，生成以后会显示 -->
    <div
      class="right flex flex-col w-full p-4 items-center justify-between"
      v-if="showRight"
    >
      <img src="@/assets/image/u727.svg" alt="" class="w-1/3 cursor-pointer" />
      <div class="flex cursor-pointer">
        <el-icon style="color: #31969a"><View /></el-icon>
        <span style="color: #31969a">试卷预览</span>
      </div>
      <span class="reRender">
        不满意？
        <a @click="renderPaper">重新生成！</a>
      </span>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  autoRenderForm: Object,
  fatherHasClick: Boolean,
});
const loading = ref(false);
watch(
  () => props.fatherHasClick,
  (newVal) => {
    // 点击了生成按钮
    renderPaper();
  }
);

// 页面相关
const formatTooltip = (val) => {
  return val / 100;
};
const showRight = ref(false);
const renderPaper = () => {
  loading.value = true;
  showRight.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<style lang="less" scoped>
/deep/.el-input-group {
  width: 12rem;
}
/deep/.el-select {
  width: 15.375rem;
}
.left {
  flex: 4;
}
.right {
  flex: 2;
}
.reRender{
    font-size: 12px;
    color: #31969a;
    display: flex;
    width: 100%;
    justify-content: flex-end;
}
</style>
