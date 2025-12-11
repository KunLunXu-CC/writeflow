import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema: (): NodeSpec => baseTableNodes.table_cell,
});
