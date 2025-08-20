import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';

export const TableHeader = Node.create({
  name: 'table_header',

  addSchema() {
    return baseTableNodes.table_header;
  },
});
