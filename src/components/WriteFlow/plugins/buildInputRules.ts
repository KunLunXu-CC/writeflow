/**
 * 基于 prosemirror-inputrules 模块进行扩展, 最终导出的是一个插件
 * 目的是为了将「输入规则」附加到编辑器, 编辑器可以对用户输入的文本做出反应或进行转换
 * 参考文档: https://prosemirror.net/docs/ref/#inputrules
 */
import {
  emDash,
  ellipsis,
  inputRules,
  // smartQuotes,
} from 'prosemirror-inputrules';

// 一组用于创建基本块引号、列表、代码块和标题的输入规则。
const customInputRules = inputRules({
  rules: [
    // ...smartQuotes, // " 和 ' 的智能转换, 比如 "hello" 转换为 "hello", 或者 'hello' 转换为 'hello'
    ellipsis, // 将三个点转换为省略号, 比如 ... 转换为 …
    emDash, // 将双破折号转换为长破折号, 比如 -- 转换为 —
  ],
});

export default customInputRules;
