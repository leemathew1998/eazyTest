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
        { value: 1048, name: "前端" },
        { value: 735, name: "测试" },
        { value: 580, name: "后端" },
        { value: 484, name: "设计" },
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
    source: [
      ["product", "2012", "2013", "2014", "2015"],
      ["60分以下", 41.1, 30.4, 65.1, 53.3],
      ["60-69分", 86.5, 92.1, 85.7, 83.1],
      ["70-79分", 86.5, 92.1, 85.7, 83.1],
      ["80-89分", 86.5, 92.1, 85.7, 83.1],
      ["90-100分", 86.5, 92.1, 85.7, 83.1],
    ],
  },
  xAxis: { type: "category" },
  yAxis: [
    {
      type: "value",
      name: "单位（人）",
    },
  ],
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }, { type: "bar" }],
  color: ["#1791FC", "#45D6B6", "#98DE26", "#18E6E6"],
};
