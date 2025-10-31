import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { getSelectedCells, mergeSelectedCells } from './helpers';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema() {
    return baseTableNodes.table_cell;
  },

  addCommands: ({ writeFlow }) => {
    return {
      mergeSelectedCells: () => {
        return mergeSelectedCells(writeFlow.view);
      },
    };
  },

  addHelpers: ({ writeFlow }) => {
    return {
      getSelectedCells: () => getSelectedCells(writeFlow.view),
    };
  },
});
