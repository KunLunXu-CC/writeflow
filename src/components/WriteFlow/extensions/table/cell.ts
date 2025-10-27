import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { getSelectedCells } from './helpers';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema() {
    return baseTableNodes.table_cell;
  },

  addHelpers: ({ writeFlow }) => {
    return {
      getSelectedCells: () => getSelectedCells(writeFlow.view),
    };
  },
});
