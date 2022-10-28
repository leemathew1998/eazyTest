export const parseHtml = (html) => {
  const [returnHtml, leftHtml] = html.split("<blockquote>测试用例");

  const trsStartIndex = leftHtml.indexOf("<tbody>") + 7;
  const trsEndIndex = leftHtml.indexOf("</tbody>");
  let trList = leftHtml.slice(trsStartIndex, trsEndIndex);
  /*
    trList是;
      <tr>
        <th colSpan="1" rowSpan="1" width="auto">nums</th>
        <th colSpan="1" rowSpan="1" width="auto">target</th>
        <th colSpan="1" rowSpan="1" width="auto">Output</th>
      </tr>
      <tr>
          <td colSpan="1" rowSpan="1" width="auto">[2,7,11,15]</td>
          <td colSpan="1" rowSpan="1" width="auto">9</td>
          <td colSpan="1" rowSpan="1" width="auto">[0, 1]</td>
      </tr>
....
   */
  const InputParameters = {};
  const OutputMap = [];
  walkTrs(trList, InputParameters, OutputMap);
  InputParameters["Output"] = OutputMap;
  return InputParameters;
};

const walkTrs = (trList, InputParameters, OutputMap) => {
  /*
   *@Author: jkwei
   *@Date: 2022-10-26 18:48:26
   *@Description: 最好使用正则进行匹配！现在写的很差，我自己都看不懂
   */
  let parameterOrder = [];
  while (trList.length) {
    let startIndex = trList.indexOf("<tr>") + 4;
    let endIndex = trList.indexOf("</tr>");
    let OnePieceTr = trList.slice(startIndex, endIndex);
    trList = trList.slice(endIndex + 5);
    if (Object.keys(InputParameters).length === 0) {
      // 第一次，所以是表头
      while (OnePieceTr.length) {
        startIndex = OnePieceTr.indexOf(`">`) + 2;
        endIndex = OnePieceTr.indexOf("</th>");
        let parameter = OnePieceTr.slice(startIndex, endIndex);
        if (parameter !== "Output") {
          parameterOrder.push(parameter);
          InputParameters[parameter] = [];
        }
        OnePieceTr = OnePieceTr.slice(endIndex + 5);
      }
    } else {
      // debugger
      let index = 0;
      let parameter;
      while (OnePieceTr.length) {
        startIndex = OnePieceTr.indexOf(`">`) + 2;
        endIndex = OnePieceTr.indexOf("</td>");
        parameter = OnePieceTr.slice(startIndex, endIndex);
        if (index < parameterOrder.length) {
          InputParameters[parameterOrder[index]].push(parameter);
          index++;
        }
        OnePieceTr = OnePieceTr.slice(endIndex + 5);
      }
      OutputMap.push(parameter);
    }
  }
};

export const loopToFillState = (store, countMap) => {
  store.$reset()
  Object.keys(countMap).forEach((name) => {
    for (let i = 0; i < countMap[name]; i++) {
      if (name === "多选") {
        store.answers[name].push({
          answer: [],
        });
      } else {
        store.answers[name].push({
          answer: "",
        });
      }
    }
  });
};
