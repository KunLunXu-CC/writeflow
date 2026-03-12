import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { Node } from '@kunlunxu/wf-core';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { PRIORITY_LEVEL } from '@kunlunxu/wf-core';

/**
 * 列表项
 */
export const ListItem = Node.create({
  name: 'list_item',

  priority: PRIORITY_LEVEL.MEDIUM,

  addSchema: (): NodeSpec => ({
    defining: true,
    content: 'paragraph block*',
    toDOM: () => [
      'li',
      {
        class: 'wf-list-item',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'li',
      },
    ],
  }),

  addKeymap: ({ type }) => ({
    Enter: splitListItem(type as NodeType), // 按 enter 键, 会拆分列表项
    Tab: sinkListItem(type as NodeType), // 按 tab 键, 会下沉列表项
    'Shift-Tab': liftListItem(type as NodeType), // 按 shift + tab 键, 会上移列表项
  }),
});
