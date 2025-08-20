import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';

export const TableRow = Node.create({
  name: 'table_row',

  addSchema() {
    return baseTableNodes.table_row;
  },
});
