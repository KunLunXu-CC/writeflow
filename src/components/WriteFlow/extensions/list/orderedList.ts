import { Node } from '@/components/WriteFlow/core/Node';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';

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
    toDOM: (node) => {
      return [
        'ol',
        {
          start: node.attrs.order,
          class: 'wf-ordered-list',
        },
        0,
      ];
    },
    parseDOM: [
      {
        tag: 'ol',
      },
    ],
  }),

  addCommands: ({ writeFlow, type }) => ({
    insertOrderedList: (opts: { end?: number; start?: number; order?: number } = {}) => {
      const { end, start, order } = opts;
      writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
        attrs: { ordered_list: { order } },
      });
    },
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^(\d+)\.\s$/, (state, match, start, end) => {
      writeFlow.commands.insertOrderedList({
        end,
        start,
        order: +match[1],
      });
      return writeFlow.state.tr;
    }),
  ],
});
