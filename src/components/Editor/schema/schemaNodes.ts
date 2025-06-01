import { NodeSpec } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';
import { tableNodes } from '@/components/Editor/tableBlock';
import { bulletList, listItem, orderedList } from 'prosemirror-schema-list';

const listNodes = {
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
};

const schemaNodes: Record<string, NodeSpec> = {
  ...nodes,
  ...listNodes,
  ...tableNodes,
};

export default schemaNodes;
