export const leftChart = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "0%",
    left: "center",
  },
  series: [
    {
      name: "考试人数类型分布图",
      type: "pie",
      radius: ["40%", "60%"],
      avoidLabelOverlap: true,
      labelLine: {
        show: true,
      },
      data: [
        { value: 0, name: "前端" },
        { value: 0, name: "测试" },
        { value: 0, name: "后端" },
        { value: 0, name: "设计" },
      ],
    },
  ],
  color: ["#1791FC", "#45D6B6", "#98DE26", "#18E6E6"],
};
export const rightChart = {
  legend: {},
  tooltip: {},
  dataset: {
    dimensions: ["product", "前端", "后端", "设计", "测试"],
    source: [["product", "2012", "2013", "2014", "2015"], [], [], [], [], []],
  },
  xAxis: { type: "category" },
  yAxis: [
    {
      type: "value",
      name: "单位（人）",
      minInterval: 1,
    },
  ],
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }, { type: "bar" }],
  color: ["#1791FC", "#45D6B6", "#98DE26", "#18E6E6"],
};
