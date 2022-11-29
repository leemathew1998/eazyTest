import CryptoJS from "crypto-js";
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

const KEY = CryptoJS.enc.Utf8.parse("nanruijituan2022");
const IV = CryptoJS.enc.Utf8.parse("nanruijituan2022");
export const EncryptScore = (word, keyStr, ivStr) => {
  let key = KEY;
  let iv = IV;

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  let srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};