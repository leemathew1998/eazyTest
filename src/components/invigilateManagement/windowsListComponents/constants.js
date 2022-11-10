export const echartOption = {
  legend: {},
  tooltip: {},
  dataset: {
    dimensions: ["product", "正在答题人数", "未答人数"],
    source: [
      // ["product", "2012", "2013", "2014", "2015"],
      ["第一题", 41.1, 30.4],
      ["第二题", 86.5, 92.1],
      ["第三题", 86.5, 92.1],
      ["第四题", 86.5, 92.1],
      ["第五题", 86.5, 92.1],
      ["第6题", 41.1, 30.4],
      ["第7题", 86.5, 92.1],
      ["第8题", 86.5, 92.1],
      ["第9题", 86.5, 92.1],
      ["第10题", 86.5, 92.1],
      ["第11题", 41.1, 30.4],
      ["第12题", 86.5, 92.1],
      ["第13题", 86.5, 92.1],
      ["第14题", 86.5, 92.1],
      ["第15题", 86.5, 92.1],
    ],
  },
  xAxis: { type: "category" },
  yAxis: [
    {
      type: "value",
      name: "人数（个）",
    },
  ],
  dataZoom: [
    {
      orient: "horizontal",
      show: true, //控制滚动条显示隐藏
      realtime: true, //拖动滚动条时是否动态的更新图表数据
      height: 15, //滚动条高度
      start: 0, //滚动条开始位置（共100等份）
      end: 20, //滚动条结束位置
      zoomLock: true, //控制面板是否进行缩放
    },
    {
      type: "inside",
      brushSelect: true,
      start: 0,
      end: 100,
      xAxisIndex: [0],
    },
  ],
  series: [
    {
      type: "bar",
      itemStyle: {
        normal: {
          //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
          barBorderRadius: [6, 6, 0, 0],
        },
      },
    },
    {
      type: "bar",
      itemStyle: {
        normal: {
          //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
          barBorderRadius: [6, 6, 0, 0],
        },
      },
    },
  ],
  color: ["#0091FF", "#45D6B6", "#F7B502", "#FA1E1F"],
};

export const mapTimeLoop = {
  0: [20, 40],
  20: [40, 60],
  40: [60, 80],
  60: [80, 100],
  80: [0, 20],
};
