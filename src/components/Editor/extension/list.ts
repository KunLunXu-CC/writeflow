import { NodeSpec } from 'prosemirror-model';
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list';
import mySchema from '@/components/Editor/schema';
import { InputRule } from 'prosemirror-inputrules';

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

    // tr.insert(start, tableItem);
    // return tr;
    // return tr.setSelection(TextSelection.create(tr.doc, start));

    // const $from = state.selection.$from;
    // // const listItemPos = $from.before(-1);
    // const attrs = { checked: match[1] === 'x' };
    // return state.tr
    //   .delete(start, end)
    //   .insert(start, mySchema.nodes.todo_item.create(attrs));
    // if (
    //   $from.depth >= 3 &&
    //   $from.node(-1).type.name === 'todo_item' &&
    //   $from.node(-2).type.name === 'todo_list' &&
    //   $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
    // ) {
    //   const attrs = { checked: match[1] === 'x' };
    //   const listItemPos = $from.before(-1);
    //   return state.tr
    //     .delete(start, end)
    //     .insert(listItemPos + 1, mySchema.nodes.todo_item.create(attrs));
    // }
    // return null;
  },
);
