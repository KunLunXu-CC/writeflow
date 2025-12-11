import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';

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
        'data-type': 'taskList',
      },
      0,
    ],
  }),

  addInputRules: ({ schema }) => [
    new InputRule(/^\[([ |x])\]\s$/, (state, match, start, end) => {
      const attrs = { checked: match[1] === 'x' };
      const taskItem = schema.nodes.task_item.createAndFill(attrs);
      const taskList = schema.nodes.task_list.createAndFill(null, taskItem)!;
      return state.tr.delete(start, end).replaceSelectionWith(taskList);
    }),
  ],
});
