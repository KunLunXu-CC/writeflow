import { orderedList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';

/**
 * 有序列表
 */
export const OrderedList = Node.create({
  name: 'orderedList',

  addSchema() {
    return {
      ...orderedList,
      content: 'listItem+',
      group: 'block',
    };
  },

  // 返回 InputRule 对象 { find, handler }[] 的数组
  // 有序列表, 将一个以数字后跟一个点开头的文本块转换为有序列表。
  addInputRules({ type }) {
    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        type,
        (match) => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order == +match[1],
      ),
    ];
  },
});
