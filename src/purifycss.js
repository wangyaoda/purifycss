const fs = require("fs");
const CleanCss = require("clean-css");
const CssTreeWalker = require("./CssTreeWalker");
const FileUtil = require("./utils/FileUtil");
const PrintUtil = require("./utils/PrintUtil");
const SelectorFilter = require("./SelectorFilter");
const { getAllWordsInContent } = require("./utils/ExtractWordsUtil");

const OPTIONS = {
  // 输出文件路径
  output: false,
  // 设置为true 进行缩小
  minify: false,
  //   记录有多少CSS被溢出的信息
  info: false,
  //   如果为true 记录已删除的CSS规则
  rejected: false,
  //  白名单 一个选择器数组，始终保留在其中，列入['button-active','*modal']
  //  这将保留包含modal的任何选择器和匹配button-active的选择器
  whitelist: [],
  //  minify的规则  按照options 进行缩小Css
  cleanCssOptions: {},
};

const getOptions = (options = {}) => {
  let opt = {};

  for (let option in OPTIONS) {
    //   初始化options 参数
    opt[option] = options[option] || OPTIONS[option];
  }
  return opt;
};

const minify = (cssSource, options) =>
  new CleanCss(options).minify(cssSource).styles;

/**
 *
 * @param {*} searchThrough html 内容 支持已使用模板的文件的全局文件模式数组 也可以是模板的字符串
 * @param {*} css  array or string 要过滤出的CSS内容
 * @param {*} options  一些可选的变量
 * @param {*} callback 回调函数 回调函数中会将过滤后的CSS作为参数返回
 * @returns
 */

const purify = (searchThrough, css, options, callback) => {
  // options 可以传入函数模式 ，函数模式后 不允许传入callback
  // 因为 callback 回调函数 就是 传入的 options选项
  // callback 会将净化后的css作为参数返回回来
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  // 获取参数的默认值
  options = getOptions(options);

    // 处理CSS 和 模板内容
    
  let cssString = FileUtil.filesToSource(css, "css");
    
  let content = FileUtil.filesToSource(searchThrough, "content");

//   console.log("输出的content模板内容:", content);

  PrintUtil.startLog(minify(cssString).length);

  let wordsInContent = getAllWordsInContent(content),
    selectorFilter = new SelectorFilter(wordsInContent, options.whitelist),
    tree = new CssTreeWalker(cssString, [selectorFilter]);
  tree.beginReading();
  let source = tree.toString();

  source = options.minify ? minify(source, options.cleanCssOptions) : source;

  // Option info = true
  if (options.info) {
    if (options.minify) {
      PrintUtil.printInfo(source.length);
    } else {
      PrintUtil.printInfo(minify(source, options.cleanCssOptions).length);
    }
  }

  // Option rejected = true
  if (options.rejected && selectorFilter.rejectedSelectors.length) {
    PrintUtil.printRejected(selectorFilter.rejectedSelectors);
  }

  if (options.output) {
    fs.writeFile(options.output, source, (err) => {
      if (err) return err;
    });
  } else {
    return callback ? callback(source) : source;
  }
};

module.exports = purify;
