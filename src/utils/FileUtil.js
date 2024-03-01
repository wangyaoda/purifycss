const UglifyJS = require("uglify-js");
const fs = require("fs");
const glob = require("glob");
const { log } = require("console");

// 该函数用来压缩JavaScript代码的.接受一个JavaScript字符串输入,
// 使用UglifyJs库对其进行压缩处理
const compressCode = (code) => {
  try {
    // 将输入的字符串解析成抽象语法树
    let ast = UglifyJS.parse(code);
    //   对AST 进行作用域分析
    ast.figure_out_scope();
    //   创建一个压缩器 (Compressor) 对象 配置为不生成警告信息
    let compressor = UglifyJS.Compressor({ warnings: false });
    //   使用压缩器对AST进行转换 进行代码压缩处理
    ast = ast.transform(compressor);
    //   再次计算作用域分析
    ast.figure_out_scope();
    //   计算字符频率 用于变量名混淆
    ast.compute_char_frequency();
    // 对定义作用于的变量名进行混淆
    ast.mangle_names({ toplevel: true });
    //   将处理后的AST打印成字符串 并将字符串小写将（这一步可能是为了统一格式）。
    code = ast.print_to_string().toLowerCase();
  } catch (e) {
    //   如果压缩错误
    //   例如无法解析为AST 则捕获异常并返回原始的代码字符串
    //   (假设原始代码字符串不是JavaScript代码)
    // If compression fails, assume it's not a JS file and return the full code.
  }
  // 返回经过压缩处理的JavaScript代码字符串(或者原始字符串)
  return code.toLowerCase();
};

// 将files 数组中多个文件合并成一个字符串
const concatFiles = (files, options) => {
  // 遍历files
  return files.reduce((total, file) => {
    let code = "";
    try {
      // 同步读取files 数组中的每一个模板或者CSS
      code = fs.readFileSync(file, "utf8");
      //   如果是模板的话 (compress 表示的是模板 而不是CSS )
      // 进行下面的compressCode 操作 决定是否对文件及逆行压缩处理
      code = options.compress ? compressCode(code) : code;
    } catch (e) {
      console.warn(e.message);
    }
    //  返回一个整合的字符串
    return `${total}${code} `;
  }, "");
};

// 将文件路径模式的数组转换成具体的文件路径数组
const getFilesFromPatternArray = (fileArray) => {
  let sourceFiles = {}; // 用于存储文件路径的对象

  for (let string of fileArray) {
    try {
      // 尝试 同步方法获取文件或目录的信息
      fs.statSync(string);
      // 如果没有抛出异常，说明是文件路径，将其添加到 sourceFiles 对象中
      sourceFiles[string] = true;
    } catch (e) {
      // 如果抛出异常 说明不是文件路径模式，使用glob.sync 获取匹配的文件路径数组
      const files = glob.sync(string);
      // 将匹配到的文件路径数组添加到 sourceFiles 中
      files.forEach((file) => {
        sourceFiles[file] = true;
      });
    }
  }

  //   返回文件路径数组
  return Object.keys(sourceFiles);
};

const filesToSource = (files, type) => {
  // 判断传入的是CSS还是模板
  const isContent = type === "content";
  const options = { compress: isContent };

  // 如果传入的是模板数组的情况
  if (Array.isArray(files)) {
    files = getFilesFromPatternArray(files);
    return concatFiles(files, options);
  }

  return isContent ? compressCode(files) : files;
};

module.exports = {
  concatFiles,
  filesToSource,
  getFilesFromPatternArray,
};
