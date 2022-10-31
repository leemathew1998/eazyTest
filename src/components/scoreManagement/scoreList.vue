<template>
  <BasicCardVue>
    <template #title>成绩列表</template>
    <template #mainContent>
      <el-table
        :data="tableData"
        stripe
        style="height: 60%; width: 100%"
        :default-sort="{ prop: 'useCount', order: 'descending' }"
      >
        <el-table-column prop="index" label="序号" />
        <el-table-column prop="level" label="题目难度" />
        <el-table-column prop="class" label="知识分类" />
        <el-table-column prop="content" label="题目内容" />
        <el-table-column prop="useCount" sortable label="使用次数">
          <template #default="scope">
            {{ `${scope.row.useCount}次` }}
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数" />
        <el-table-column prop="createdBy" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" min-width="180" />
        <el-table-column
          prop="action"
          label="操作"
          fixed="right"
          min-width="140"
        >
          <template #default="scope">
            <a
              style="color: #31969a"
              href="javascript:;"
              @click="changeInfo(scope.row)"
              >修改信息</a
            >
            <el-divider direction="vertical" />
            <a
              style="color: red"
              href="javascript:;"
              @click="deleteItem(scope.row)"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </template>
  </BasicCardVue>
</template>
<script setup>
import { reactive, ref } from "vue";
import BasicCardVue from "@/components/basicCard.vue";
const tableData = reactive([]);
for (let index = 0; index < 20; index++) {
  let useCountNumber = Math.floor(Math.random() * 20);
  tableData.push({
    index: index + 1,
    level: Math.random() > 0.5 ? "简单" : "困难",
    class: Math.random() > 0.5 ? "编程题目" : "电力知识",
    content: Math.random() > 0.5 ? "请说出..." : "请选择...",
    useCount: useCountNumber,
    score: Math.floor(Math.random() * 8 + 1),
    createdBy: "张三",
    createdTime: "2022-10-31 12:21:12",
  });
}
const changeInfo = (record) => {
  console.log(record);
};
const deleteItem = (record) => {
  console.log(record);
};

// 上传
const uploadModal = ref(false);
// 新增
const increaseModal = ref(false);
</script>
<style lang="less" scoped>
@import url("@/assets/css/common.less");
</style>
