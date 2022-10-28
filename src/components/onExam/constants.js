export const questions = [];

for (let index = 0; index < 20; index++) {
  questions.push({
    type: "单选",
    count: index + 1,
    content: "下列哪一项属性不属于字体<font>标记属性。",
  });
}

for (let index = 20; index < 40; index++) {
  questions.push({
    type: "多选",
    count: index + 1,
    content: "下列哪一项属性不属于字体<font>标记属性。",
  });
}
for (let index = 40; index < 60; index++) {
  questions.push({
    type: "判断",
    count: index + 1,
    content: "下列哪一项属性不属于字体<font>标记属性。",
  });
}
for (let index = 60; index < 80; index++) {
  questions.push({
    type: "简答",
    count: index + 1,
    content: "下列哪一项属性不属于字体<font>标记属性。",
  });
}

for (let index = 80; index < 100; index++) {
  questions.push({
    type: "编程",
    count: index + 1,
    content: "下列哪一项属性不属于字体<font>标记属性。",
  });
}
