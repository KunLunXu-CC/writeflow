import { NodeSpec } from 'prosemirror-model';
import { bulletList } from 'prosemirror-schema-list';
import { InputRule } from 'prosemirror-inputrules';
import { Node } from '@/components/WriteFlow/core/Node';
import { insertTaskList, InsertTaskItemOptions } from './commands';

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

  addCommands: ({ writeFlow, extension }) => ({
    insertTaskList: (opts: InsertTaskItemOptions) => insertTaskList({ writeFlow, extension }, opts),
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\[([ |x])\]\s$/, (state, match, start, end) => {
      writeFlow.commands.insertTaskList({
        end,
        start,
        attrs: { checked: match[1] === 'x' },
      });

      return writeFlow.state.tr;
    }),
  ],
});
