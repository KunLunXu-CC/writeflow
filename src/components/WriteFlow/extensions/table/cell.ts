import { Node } from '@/components/WriteFlow/core/Node';
import { baseTableNodes } from '.';
import { getTableSelectedCells } from './helpers';
import { mergeTableCells } from './commands';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema() {
    return baseTableNodes.table_cell;
  },

  addCommands: ({ writeFlow }) => {
    return {
      mergeTableCells: () => {
        return mergeTableCells(writeFlow.view);
      },
    };
  },

  addHelpers: ({ writeFlow }) => {
    return {
      getTableSelectedCells: () => getTableSelectedCells(writeFlow.view),
    };
  },
});
