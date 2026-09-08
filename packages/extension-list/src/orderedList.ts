import { Node } from '@kunlunxu/wf-core';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';
import { convertList } from './commands';

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
        getAttrs: (dom) => {
          const startAttr = dom.getAttribute('start');
          const order = startAttr ? parseInt(startAttr, 10) : 1;
          return { order };
        },
      },
    ],
  }),

  addCommands: ({ writeFlow, extension, type }) => ({
    insertOrderedList: (opts: { end?: number; start?: number; order?: number } = {}) => {
      const { end, start, order } = opts;

      if (
        convertList(
          { writeFlow, extension },
          {
            end,
            start,
            listAttrs: { order },
            listType: type as NodeType,
            itemType: writeFlow.schema.nodes.list_item,
          },
        )
      ) {
        return true;
      }

      return writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
        attrs: { ordered_list: { order } },
      });
    },
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^(\d+)\.\s$/, (_state, match, start, end) => {
      const order = +match[1];
      writeFlow.commands.insertOrderedList({
        end,
        start,
        order,
      });
      return writeFlow.state.tr;
    }),
  ],
});
