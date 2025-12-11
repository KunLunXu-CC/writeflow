import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableHeader = Node.create({
  name: 'table_header',

  addSchema: (): NodeSpec => baseTableNodes.table_header,
});
