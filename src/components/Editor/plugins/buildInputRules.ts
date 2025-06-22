/**
 * 基于 prosemirror-inputrules 模块进行扩展, 最终导出的是一个插件
 * 目的是为了将「输入规则」附加到编辑器, 编辑器可以对用户输入的文本做出反应或进行转换
 * 参考文档: https://prosemirror.net/docs/ref/#inputrules
 */
import {
  emDash,
  ellipsis,
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  // smartQuotes,
} from 'prosemirror-inputrules';
import { taskListInputRule } from '@/components/Editor/extension/list';
import { tableInputRule } from '@/components/Editor/extension/tableBlock';
import { codeBlockInputRule } from '@/components/Editor/extension/codeBlock';
import { inlineCodeInputRule } from '@/components/Editor/extension/inlineCode';
import mySchema from '@/components/Editor/schema';

// 一组用于创建基本块引号、列表、代码块和标题的输入规则。
const customInputRules = inputRules({
  rules: [
    // ...smartQuotes, // " 和 ' 的智能转换, 比如 "hello" 转换为 "hello", 或者 'hello' 转换为 'hello'
    ellipsis, // 将三个点转换为省略号, 比如 ... 转换为 …
    emDash, // 将双破折号转换为长破折号, 比如 -- 转换为 —
    tableInputRule, // 表格, 将一个以 |- 开头的文本块转换为表格
    taskListInputRule, // 任务列表, 将一个以 [ ] 开头的文本块转换为任务列表。
    codeBlockInputRule, // 代码块, 将一个以三个反引号开头的文本块转换为代码块。
    inlineCodeInputRule, // 内联代码, 将 `code` 转换为内联代码块。
    // 块引用, 将一个以 > 开头的文本块转换为块引用。
    wrappingInputRule(/^\s*>\s$/, mySchema.nodes.blockquote),
    // 有序列表, 将一个以数字后跟一个点开头的文本块转换为有序列表。
    wrappingInputRule(
      /^(\d+)\.\s$/,
      mySchema.nodes.ordered_list,
      (match) => ({ order: +match[1] }),
      (match, node) => node.childCount + node.attrs.order == +match[1],
    ),
    // 无序列表, 将一个以破折号、加号或星号开头的文本块转换为无序列表。
    wrappingInputRule(/^\s*([-+*])\s$/, mySchema.nodes.bullet_list),

    // 标题, 将一个以最多为 6 个 `#` 字符后跟一个空格的文本块转换为对应级别的标题。
    textblockTypeInputRule(
      new RegExp('^(#{1,6})\\s$'),
      mySchema.nodes.heading,
      (match) => ({
        level: match[1].length,
      }),
    ),
  ],
});

export default customInputRules;
