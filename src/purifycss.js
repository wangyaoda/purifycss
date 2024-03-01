const fs = require("fs");
const CleanCss = require('clean-css');
const CssTreeWalker = require("./CssTreeWalker");
const FileUtil = require("./utils/FileUtil");
const PrintUtil = require("./utils/PrintUtil");
const SelectorFilter = require("./SelectorFilter");
const { getAllWordsInContent } = require("./utils/ExtractWordsUtil");

const OPTIONS = {
    output: false,
    minify: false,
    info: false,
    rejected: false,
    whitelist: [],
    cleanCssOptions: {}
};

const getOptions = (options = {}) => {
    let opt = {};
    for (let option in OPTIONS) {
        opt[option] = options[option] || OPTIONS[option];
    }
    return opt;
};

const minify = (cssSource, options) =>
    new CleanCss(options).minify(cssSource).styles;

const purify = (searchThrough, css, options, callback) => {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    options = getOptions(options);
    let cssString = FileUtil.filesToSource(css, "css"),
        content = FileUtil.filesToSource(searchThrough, "content");
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
        fs.writeFile(options.output, source, err => {
            if (err) return err;
        });
    } else {
        return callback ? callback(source) : source;
    }
};

module.exports = purify;
