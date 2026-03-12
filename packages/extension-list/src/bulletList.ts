import { InputRule } from 'prosemirror-inputrules';
import { Node } from '@/components/WriteFlow/core/Node';
import { NodeSpec, NodeType } from 'prosemirror-model';

/**
 * 无序列表
 */
export const BulletList = Node.create({
  name: 'bullet_list',

  addSchema: (): NodeSpec => ({
    group: 'block',
    content: 'list_item+',
    toDOM: () => [
      'ul',
      {
        class: 'wf-bullet-list',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'ul',
      },
    ],
  }),
  addCommands: ({ writeFlow, type }) => ({
    insertBulletList: (opts: { end?: number; start?: number } = {}) => {
      const { end, start } = opts;
      writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
      });
    },
  }),
  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\s*([-+*])\s$/, (state, match, start, end) => {
      writeFlow.commands.insertBulletList({ end, start });
      return writeFlow.state.tr;
    }),
  ],
});
