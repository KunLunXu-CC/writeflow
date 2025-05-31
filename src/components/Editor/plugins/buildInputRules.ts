import {
  emDash,
  ellipsis,
  inputRules,
  smartQuotes,
  wrappingInputRule,
  textblockTypeInputRule,
} from 'prosemirror-inputrules';
import { NodeType, Schema } from 'prosemirror-model';

/// 引用: 给定一个块引用节点类型，创建一个输入规则，将一个以 `"> "` 开头的文本块转换为块引用。
const blockQuoteRule = (nodeType: NodeType) => {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
};

// 有序列表: 给定一个列表节点类型，创建一个输入规则，将一个以数字后跟一个点开头的文本块转换为有序列表。
const orderedListRule = (nodeType: NodeType) => {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1],
  );
};

// 无序列表: 给定一个列表节点类型，创建一个输入规则，将一个以破折号、加号或星号开头的文本块转换为无序列表。
const bulletListRule = (nodeType: NodeType) => {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
};

// 代码块: 给定一个代码块节点类型，创建一个输入规则，将一个以三个反引号开头的文本块转换为代码块。
const codeBlockRule = (nodeType: NodeType) => {
  return textblockTypeInputRule(/^```$/, nodeType);
};

// 标题: 给定一个节点类型和最大级别，创建一个输入规则，将最多为该数量的 `#` 字符后跟一个空格的文本块转换为对应级别的标题。
const headingRule = (nodeType: NodeType, maxLevel: number) => {
  return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'), nodeType, (match) => ({
    level: match[1].length,
  }));
};

// 一组用于创建基本块引号、列表、代码块和标题的输入规则。
export default (schema: Schema) => {
  let rules = smartQuotes.concat(ellipsis, emDash),
    type;
  if ((type = schema.nodes.heading)) rules.push(headingRule(type, 6));
  if ((type = schema.nodes.code_block)) rules.push(codeBlockRule(type));
  if ((type = schema.nodes.blockquote)) rules.push(blockQuoteRule(type));
  if ((type = schema.nodes.bullet_list)) rules.push(bulletListRule(type));
  if ((type = schema.nodes.ordered_list)) rules.push(orderedListRule(type));
  return inputRules({ rules });
};
