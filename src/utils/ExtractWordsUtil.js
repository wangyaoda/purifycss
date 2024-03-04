const fs = require("fs");

const addWord = (words, word) => {
  if (word) words.push(word);
};

// 将传入的模板内容按照非字母字符进行分割
// 得到一个包含所有单词的数组 words 然后遍历 words 数组中的每一个单词
// 将每一个单词加入到used 对象中
// 该函数提取给定文本内容中的所有单词 返回一个对象 所有value 都是 true
const getAllWordsInContent = (content) => {
  let used = {
    html: true,
    body: true,
  };
  const words = content.split(/[^a-z]/g);
  for (let word of words) {
    used[word] = true;
  }
  return used;
};

// 该函数的作用是从给定的CSS选择器中提取出单词, 并返回一个单词数组
const getAllWordsInSelector = (selector) => {
  // 使用正则去掉选择器中所有的属性选择器 eg: a[href] => a
  selector = selector.replace(/\[(.+?)\]/g, "").toLowerCase();

  // 检查选择器 检查是否还有 [ ] 如果有返回空数组[]
  if (selector.includes("[") || selector.includes("]")) {
    return [];
  }

  // 定义三个变量
  let skipNextWord = false, // 跳过下一个单词
    word = "", // 保存当前正在构建的单词
    words = []; // words 保存提取出所有的单词

  for (let letter of selector) {
    // 如果 skipNextWord 为 true 表示 当前字符是空格 井号 或者点号 跳过当前字符
    if (skipNextWord && !/[ #.]/.test(letter)) continue;
    // 如果当前字符是 : 那么可能是伪类或者为元素 将当前元素加入到words数组中
    // 重置word变成空字符串 同时将skipNextWord 变成true 表示下一个字符需要跳过
    if (/[:*]/.test(letter)) {
      addWord(words, word);
      word = "";
      skipNextWord = true;
      continue;
    }
    // 如果当前字符是小写字母 将其加入到word变量中 拼接成一个单词 如果不是小写字母
    // 则表示当前单词构建完成 加入到words数组中 重置word变量为一个空字符串
    if (/[a-z]/.test(letter)) {
      word += letter;
    } else {
      addWord(words, word);
      word = "";
      skipNextWord = false;
    }
  }
  // 将最后一个构建单词加入到words数组中
  addWord(words, word);
  // 返回数组 包含了提取出的单词
  return words;
};

module.exports = {
  getAllWordsInContent,
  getAllWordsInSelector,
};
