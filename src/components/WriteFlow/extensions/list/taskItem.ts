import { Node } from '@/components/WriteFlow/core/Node';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { PRIORITY_LEVEL } from '@/components/WriteFlow/types';
import { listItem, sinkListItem, liftListItem, splitListItem } from 'prosemirror-schema-list';

/**
 * 任务列表项
 */
export const TaskItem = Node.create({
  name: 'task_item',

  priority: PRIORITY_LEVEL.MEDIUM,

  addSchema: (): NodeSpec => ({
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
          'data-type': 'taskItem',
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
          ['span'],
        ],
        ['div', 0],
      ];
    },
  }),

  addKeymap: ({ type }) => ({
    Enter: splitListItem(type as NodeType, { checked: false }), // 按 enter 键, 会拆分列表项
    Tab: sinkListItem(type as NodeType), // 按 tab 键, 会下沉列表项
    'Shift-Tab': liftListItem(type as NodeType), // 按 shift + tab 键, 会上移列表项
  }),
});
