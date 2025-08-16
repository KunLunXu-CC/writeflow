import {
  listItem,
  sinkListItem,
  liftListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';

/**
 * 任务列表项
 */
export const TaskItem = Node.create({
  name: 'task_item',

  getSchema() {
    return {
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
    };
  },

  addInputRules({ type }) {
    return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
  },

  addKeymap({ type }) {
    return {
      Enter: splitListItem(type), // 按 enter 键, 会拆分列表项
      Tab: sinkListItem(type), // 按 tab 键, 会下沉列表项
      'Shift-Tab': liftListItem(type), // 按 shift + tab 键, 会上移列表项
    };
  },
});
