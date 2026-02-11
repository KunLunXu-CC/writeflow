// import { orderedList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';
/**
 * 有序列表
 */
export const OrderedList = Node.create({
  name: 'ordered_list',

  addSchema: (): NodeSpec => ({
    group: 'block',
    content: 'list_item+',
    attrs: {
      order: {
        default: 1,
        validate: 'number',
      },
    },
    toDOM: () => [
      'ol',
      {
        class: 'wf-ordered-list',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'ol',
      },
    ],
  }),

  // 返回 InputRule 对象 { find, handler }[] 的数组
  // 有序列表, 将一个以数字后跟一个点开头的文本块转换为有序列表。
  addInputRules: ({ type }) => [
    wrappingInputRule(
      /^(\d+)\.\s$/,
      type as NodeType,
      (match) => ({ order: +match[1] }),
      (match, node) => node.childCount + node.attrs.order == +match[1],
    ),
  ],
});
