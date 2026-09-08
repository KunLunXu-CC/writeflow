import { InputRule } from 'prosemirror-inputrules';
import { Node } from '@kunlunxu/wf-core';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { convertList } from './commands';

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
  addCommands: ({ writeFlow, extension, type }) => ({
    insertBulletList: (opts: { end?: number; start?: number } = {}) => {
      const { end, start } = opts;

      if (
        convertList(
          { writeFlow, extension },
          {
            end,
            start,
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
      });
    },
  }),
  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\s*([-+*])\s$/, (_state, _match, start, end) => {
      writeFlow.commands.insertBulletList({ end, start });
      return writeFlow.state.tr;
    }),
  ],
});
