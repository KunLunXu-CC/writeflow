import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';

/**
 * 任务列表
 */
export const TaskList = Node.create({
  name: 'taskList',

  getSchema() {
    return {
      ...bulletList,
      content: 'taskItem+',
      group: 'block',
    };
  },

  addInputRules({ schema }) {
    return [
      new InputRule(/^\[([ |x])\]\s$/, (state, match, start, end) => {
        const attrs = { checked: match[1] === 'x' };
        const taskItem = schema.nodes.taskItem.createAndFill(attrs);
        const taskList = schema.nodes.taskList.createAndFill(null, taskItem)!;
        return state.tr.delete(start, end).replaceSelectionWith(taskList);
      }),
    ];
  },
});
