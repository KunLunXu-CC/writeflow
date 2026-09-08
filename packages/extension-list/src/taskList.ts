import { NodeSpec, NodeType } from 'prosemirror-model';
import { bulletList } from 'prosemirror-schema-list';
import { InputRule } from 'prosemirror-inputrules';
import { Node } from '@kunlunxu/wf-core';
import { convertList } from './commands';

/**
 * 任务列表
 */
export const TaskList = Node.create({
  name: 'task_list',

  addSchema: (): NodeSpec => ({
    ...bulletList,
    content: 'task_item+',
    group: 'block',
    toDOM: () => [
      'ul',
      {
        class: 'wf-task-list',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'ul.task-list',
      },
    ],
  }),

  addCommands: ({ writeFlow, extension, type }) => ({
    insertTaskList: (opts: { end?: number; start?: number; checked?: boolean } = {}) => {
      const { end, start, checked } = opts;

      if (
        convertList(
          { writeFlow, extension },
          {
            end,
            start,
            listType: type as NodeType,
            currentItemAttrs: { checked },
            itemType: writeFlow.schema.nodes.task_item,
          },
        )
      ) {
        return true;
      }

      return writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
        attrs: { task_item: { checked } },
      });
    },
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\[([ |x])\]\s$/i, (_state, match, start, end) => {
      const checked = match[1].toLowerCase() === 'x';
      writeFlow.commands.insertTaskList({
        end,
        start,
        checked,
      });
      return writeFlow.state.tr;
    }),
  ],
});
