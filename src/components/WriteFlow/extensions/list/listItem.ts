import {
  listItem,
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';

/**
 * 列表项
 */
export const ListItem = Node.create({
  name: 'listItem',

  getSchema() {
    return {
      ...listItem,
      content: 'paragraph block*',
    };
  },

  addKeymap({ type }) {
    return {
      Enter: splitListItem(type), // 按 enter 键, 会拆分列表项
      Tab: sinkListItem(type), // 按 tab 键, 会下沉列表项
      'Shift-Tab': liftListItem(type), // 按 shift + tab 键, 会上移列表项
    };
  },
});
