import { listItem, liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { NodeSpec, NodeType } from 'prosemirror-model';

/**
 * 列表项
 */
export const ListItem = Node.create({
  name: 'list_item',

  addSchema: (): NodeSpec => ({
    ...listItem,
    content: 'paragraph block*',
  }),

  addKeymap: ({ type }) => ({
    Enter: splitListItem(type as NodeType), // 按 enter 键, 会拆分列表项
    Tab: sinkListItem(type as NodeType), // 按 tab 键, 会下沉列表项
    'Shift-Tab': liftListItem(type as NodeType), // 按 shift + tab 键, 会上移列表项
  }),
});
