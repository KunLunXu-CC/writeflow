import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema() {
    return baseTableNodes.table_cell;
  },
});
