const { getAllWordsInSelector } = require("./utils/ExtractWordsUtil");

// 判断是否是 通配符白名单选择器
// purifyCss 选择器白名单规则 要始终保留的选择器数组
// ['button-active', '*modal*']，这将保留包含 modal 的任何选择器以及匹配 button-active 的选择器。（用 * 包裹字符串，会保留所有包含它的选择器）
const isWildcardWhitelistSelector = (selector) => {
  return selector[0] === "*" && selector[selector.length - 1] === "*";
};

const hasWhitelistMatch = (selector, whitelist) => {
  for (let el of whitelist) {
    if (selector.includes(el)) return true;
  }
  return false;
};

class SelectorFilter {
  /**
   *
   * @param {*} contentWords 包含所有单词的对象
   * @param {*} whitelist 是一个包含白名单选择器的数组
   */
  constructor(contentWords, whitelist) {
    this.contentWords = contentWords;
    this.rejectedSelectors = []; // 存储被拒绝的选择器，初始值为一个空数组
    this.wildcardWhitelist = []; // 存储通配符白名单选择器，初始值为一个空数组
    this.parseWhitelist(whitelist);
  }
    // 初始化CSS语法树 并监听 readRule 事件 当 readRule 事件触发后，会调用parseRule 方法来解析规则
    // 利用事件总线的方法监听事件?
  initialize(CssSyntaxTree) {
    CssSyntaxTree.on("readRule", this.parseRule.bind(this));
  }

  // 对白名单选择器列表进行解析和处理
  parseWhitelist(whitelist) {
    // 遍历白名单
    whitelist.forEach((whitelistSelector) => {
      // 将所有选择器变小写
      whitelistSelector = whitelistSelector.toLowerCase();
      //  判断第一个字符是否以 * 开头 并且 以 * 结尾
      if (isWildcardWhitelistSelector(whitelistSelector)) {
        // 将白名单的单词 去除掉 * 后添加到白名单数组中
        this.wildcardWhitelist.push(
          whitelistSelector.substr(1, whitelistSelector.length - 2)
        );
      } else {
        // 不是通配符类型的选择器
        // 使用 getAllWordsInSelector 函数过滤后 添加到 contentWords 中
        // eg 白名单词中的 'button-active' => ['button', 'active']
        getAllWordsInSelector(whitelistSelector).forEach((word) => {
          this.contentWords[word] = true;
        });
      }
    });
  }

  parseRule(selectors, rule) {
    rule.selectors = this.filterSelectors(selectors);
  }

    
  filterSelectors(selectors) {
    let contentWords = this.contentWords,
      rejectedSelectors = this.rejectedSelectors,
      wildcardWhitelist = this.wildcardWhitelist,
      usedSelectors = []; // 定义符合条件的选择器集合

      selectors.forEach((selector) => {
        // 判断选择器是否在通配符白名单中 将其加入到 usedSelectors 中 并直接返回
      if (hasWhitelistMatch(selector, wildcardWhitelist)) {
        usedSelectors.push(selector);
        return;
        }
        //  如果选择器不在白名单 使用 getAllWordsInSelector 提取单词 
        let words = getAllWordsInSelector(selector),
        // filter 方法过滤出在 contentWords 中存在的单词 ，即被匹配的单词
        usedWords = words.filter((word) => contentWords[word]);
        //  如果被匹配的单词数等于选择器中的单词数 说明所有的单词都在contentWords中之中
        // 将该选择器加入到 usedSelectors 中 否则加入到rejectedSelectors
      if (usedWords.length === words.length) {
        usedSelectors.push(selector);
      } else {
        rejectedSelectors.push(selector);
      }
    });

    return usedSelectors;
  }
}

module.exports = SelectorFilter;
