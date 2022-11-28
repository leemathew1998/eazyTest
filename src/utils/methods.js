export const parseHtml = (html) => {
  const [returnHtml, leftHtml] = html.split("<blockquote>测试用例");
  const javaScriptFunNameStart = leftHtml.indexOf("JavaScript主函数运行名称：");
  const javaScriptFunNameEnd = leftHtml.indexOf("<br>", javaScriptFunNameStart);
  const javaScriptFunName = leftHtml.slice(javaScriptFunNameStart + 18, javaScriptFunNameEnd);
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
  InputParameters["javaScriptFunName"] = javaScriptFunName;
  return [returnHtml, InputParameters];
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

export const loopToFillState = (store, countMap, randomAnswer = false) => {
  store.$reset();
  Object.keys(countMap).forEach((name) => {
    for (let i = 0; i < countMap[name]; i++) {
      if (name === "多选") {
        store.answers[name].push({
          answer: [],
        });
      } else {
        store.answers[name].push({
          answer: randomAnswer ? Math.random() : "",
        });
      }
    }
  });
};

const chineseWordReg = /[\u4e00-\u9fa5]/g;
export const solveChineseWord = (record) => {
  if (record.ttype == 5) {
    return record.tproblem.match(chineseWordReg)?.join("");
  } else {
    return record.tproblem;
  }
};

export const changeNumToHan = (num) => {
  var arr1 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var arr2 = ["", "十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千", "万", "十", "百", "千", "亿"];
  if (!num || isNaN(num)) return "零";
  var english = num.toString().split("");
  var result = "";
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; // 倒序排列设值
    result = arr2[i] + result;
    var arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十"); // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零+/g, "零"); // 合并中间多个零为一个零
  result = result.replace(/零亿/g, "亿").replace(/零万/g, "万"); // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/亿万/g, "亿"); // 将【亿万】换成【亿】
  result = result.replace(/零+$/, ""); // 移除末尾的零
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, "十");
  return result;
};
