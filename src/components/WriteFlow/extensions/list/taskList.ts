import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';

/**
 * 任务列表
 */
export const TaskList = Node.create({
  name: 'task_list',

  addSchema() {
    return {
      ...bulletList,
      content: 'task_item+',
      group: 'block',
    };
  },

  addInputRules({ schema }) {
    return [
      new InputRule(/^\[([ |x])\]\s$/, (state, match, start, end) => {
        const attrs = { checked: match[1] === 'x' };
        const taskItem = schema.nodes.task_item.createAndFill(attrs);
        const taskList = schema.nodes.task_list.createAndFill(null, taskItem)!;
        return state.tr.delete(start, end).replaceSelectionWith(taskList);
      }),
    ];
  },
});
