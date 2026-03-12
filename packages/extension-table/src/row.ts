import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableRow = Node.create({
  name: 'table_row',

  addSchema: (): NodeSpec => baseTableNodes.table_row,
});
