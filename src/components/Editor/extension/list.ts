import {
  listItem,
  bulletList,
  orderedList,
  sinkListItem,
  liftListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { Command } from 'prosemirror-state';
import { NodeSpec } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';
import { chainCommands } from 'prosemirror-commands';
import mySchema from '@/components/Editor/schema';

export const listNodes: Record<string, NodeSpec> = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },

  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },

  list_item: {
    ...listItem,
    content: 'paragraph block*',
  },

  // 任务列表
  task_list: {
    ...bulletList,
    content: 'task_item+',
    group: 'block',
  },

  task_item: {
    ...listItem,
    // 定义节点属性, 只有定义了才能正确传递获取到该属性值
    attrs: {
      checked: { default: false },
    },
    content: 'paragraph block*',
    toDOM(node) {
      const { checked } = node.attrs;
      return [
        'li',
        {
          'data-type': 'todo_item',
          'data-done': checked.toString(),
        },
        [
          'label',
          [
            'input',
            {
              type: 'checkbox',
              checked: checked ? 'checked' : null,
            },
          ],
        ],
        ['div', 0],
      ];
    },
  },
};

// 表格输入规则, 将一个以 |- 开头的文本块转换为表格
export const taskListInputRule = new InputRule(
  /^\[([ |x])\]\s$/,
  (state, match, start, end) => {
    const attrs = { checked: match[1] === 'x' };
    const taskItem = mySchema.nodes.task_item.createAndFill(attrs);
    const taskList = mySchema.nodes.task_list.createAndFill(null, taskItem)!;
    return state.tr.delete(start, end).replaceSelectionWith(taskList);
  },
);

export const listKeymap: Record<string, Command> = {
  // 列表: 按 enter 键, 会拆分列表项
  Enter: chainCommands(
    splitListItem(mySchema.nodes.list_item),
    splitListItem(mySchema.nodes.task_item),
  ),
  // 列表: 按 tab 键, 会下沉列表项
  Tab: chainCommands(
    sinkListItem(mySchema.nodes.list_item),
    sinkListItem(mySchema.nodes.task_item),
  ),
  // 列表: 按 shift + tab 键, 会上移列表项
  'Shift-Tab': chainCommands(
    liftListItem(mySchema.nodes.list_item),
    liftListItem(mySchema.nodes.task_item),
  ),
};
