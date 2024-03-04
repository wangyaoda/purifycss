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
  //  minify的规则  按照options 进行压缩CSS
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

/**
 *
 * @param {*} cssSource  Css 字符串
 * @param {*} options  传入要配置的options 用于指定压缩的行为 是否启用压缩 是否保留注释等
 * @returns
 */
// 创建一个CleanCss实例,然后调用实例中的minify方法对CSS进行压缩
/* 
Clean CSS 是一个用于压缩CSS的JavaScript库 它能够通过移除注释、空格和其他不必要的字符来减小 CSS 文件的大小，从而提高网站的加载速度并减少网络传输的数据量。 CleanCSS 还提供了一些选项，可以根据需要定制压缩的行为，例如保留特定的注释或空格。
*/
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
  // 如果CSS和模板是数组的形式传入的 合并成一个字符串 返回回来
  // 如果是模板的情况下 会使用UglifyJS进行压缩处理
  let cssString = FileUtil.filesToSource(css, "css");
  let content = FileUtil.filesToSource(searchThrough, "content");

  //  console.log("输出的content模板内容:", content);

  // console.log(minify(cssString));

  // 记录 css 长度 ? 可能后边要使用
  PrintUtil.startLog(minify(cssString).length);

  // getAllWordsInContent 将传入的模板中的每一个单词拆出 组成一个 JavaScript 对象格式
  // 包括其中的类名 eg:类名 delayed-content => delayed content 两个单词
  let wordsInContent = getAllWordsInContent(content);

  // 传入将模板拆解出的对象 和 我们要保留类名的白名单
  // SelectorFilter 是一个用于过滤 CSS 选择器的工具。
  let selectorFilter = new SelectorFilter(wordsInContent, options.whitelist);


  let tree = new CssTreeWalker(cssString, [selectorFilter]);

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
