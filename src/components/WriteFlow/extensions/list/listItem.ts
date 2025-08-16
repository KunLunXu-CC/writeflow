import { listItem } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';

/**
 * 列表项
 */
export const ListItem = Node.create({
  name: 'list_item',

  getSchema() {
    return {
      ...listItem,
      content: 'paragraph block*',
    };
  },
});
