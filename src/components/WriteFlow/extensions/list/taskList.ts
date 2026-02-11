import { NodeSpec, NodeType } from 'prosemirror-model';
import { bulletList } from 'prosemirror-schema-list';
import { InputRule } from 'prosemirror-inputrules';
import { Node } from '@/components/WriteFlow/core/Node';

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

  addCommands: ({ writeFlow, type }) => ({
    insertTaskList: (opts: { end?: number; start?: number; checked?: boolean }) => {
      const { end, start, checked } = opts;
      writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
        wrappingAttrs: { task_item: { checked } },
      });
    },
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\[([ |x])\]\s$/i, (state, match, start, end) => {
      writeFlow.commands.insertTaskList({
        end,
        start,
        checked: match[1].toLowerCase() === 'x',
      });
      return writeFlow.state.tr;
    }),
  ],
});
