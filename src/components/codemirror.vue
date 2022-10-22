<template>
  <codemirror
    v-model="code"
    :placeholder="placeholder"
    :style="{ height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tabSize="2"
    :extensions="extensions"
  />
  <button @click="changeMode">changeMode</button>
  <button @click="runCode">runCode</button>
</template>

<script setup>
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ref, reactive } from "vue";
// placeholder默认值
const placeholder = ref(`
███╗   ██╗ █████╗ ██████╗ ██╗
████╗  ██║██╔══██╗██╔══██╗██║
██╔██╗ ██║███████║██████╔╝██║
██║╚██╗██║██╔══██║██╔══██╗██║
██║ ╚████║██║  ██║██║  ██║██║
╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
                                
南瑞考试系统--Designed by nari
`);
const code = ref(`
function addTwoNumber(twoSum){
    //返回一个数组的两数之和，考生可以在此处编写代码
    return twoSum[0] + twoSum[1]
}
`);
let extensions = reactive([javascript(), oneDark]);
const changeMode = () => {
  extensions.unshift();
  extensions.push(java());
};
const runCode = () => {
  //添加执行代码
  let runTimeCode = `${code.value}
    return addTwoNumber(twoSum);`;
  //获取测试用例，并开始执行
  let twoSum = [1, 2];
  let fn = new Function("twoSum", runTimeCode);
  let result;
  try {
    result = fn(twoSum);
    if (result === 3) {
      console.log("Output=>3, 与测试案例一致，代码运行成功");
    } else {
      //结果不一致
      console.log(`结果不一致,${result}`);
    }
  } catch (e) {
    result = e;
    //代码错误
    console.log(`代码错误,${result}`);
  }
};
</script>
