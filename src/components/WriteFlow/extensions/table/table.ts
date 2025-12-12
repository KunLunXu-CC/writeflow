import { baseTableNodes } from '.';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';
import { TextSelection } from 'prosemirror-state';
import { goToNextCell, tableEditing, columnResizing } from 'prosemirror-tables';
import { TableView } from './TableVIew';

import { getTableSelectedCells } from './helpers';
import {
  deleteTableRow,
  mergeTableCells,
  addTableRowAfter,
  deleteTableColumn,
  addTableColumnAfter,
} from './commands';
import { NodeSpec } from 'prosemirror-model';

const ROW_COUNT_INPUT_RULE = 2;
const COL_COUNT_INPUT_RULE = 3;

export const Table = Node.create({
  name: 'table',

  addSchema: (): NodeSpec => baseTableNodes.table,

  // WARNING: 顺序很重要, 若把 tableEditing 放在前面, 调整宽度是会选中单元格
  addPlugins: () => [columnResizing(), tableEditing()],

  addNodeView: () => (node) => new TableView(node, 25),

  addInputRules: ({ schema }) => [
    new InputRule(/^\|-\s$/, (state, match, start, end) => {
      const cellNodes = Array.from(
        { length: COL_COUNT_INPUT_RULE },
        () => schema.nodes.table_cell.createAndFill()!,
      );

      const rowNodes = Array.from(
        { length: ROW_COUNT_INPUT_RULE },
        () => schema.nodes.table_row.createAndFill(null, cellNodes)!,
      );

      const tableNode = schema.nodes.table.createAndFill(null, rowNodes)!;
      const tr = state.tr.delete(start, end).replaceSelectionWith(tableNode);
      return tr.setSelection(TextSelection.create(tr.doc, start));
    }),
  ],

  addCommands: ({ writeFlow, extension }) => ({
    mergeTableCells: () => mergeTableCells({ writeFlow, extension }),

    addTableRowAfter: () => addTableRowAfter({ writeFlow, extension }),
    addTableColumnAfter: () => addTableColumnAfter({ writeFlow, extension }),

    deleteTableRow: () => deleteTableRow({ writeFlow, extension }),
    deleteTableColumn: () => deleteTableColumn({ writeFlow, extension }),
  }),

  addHelpers: ({ writeFlow, extension }) => ({
    getTableSelectedCells: () => getTableSelectedCells({ writeFlow, extension }),
  }),

  addKeymap: () => ({
    Tab: goToNextCell(1),
    'Shift-Tab': goToNextCell(-1),

    // Tab: () => {
    //   if (this.editor.commands.goToNextCell()) {
    //     return true
    //   }

    //   if (!this.editor.can().addRowAfter()) {
    //     return false
    //   }

    //   return this.editor.chain().addRowAfter().goToNextCell().run()
    // },
    // 'Shift-Tab': () => this.editor.commands.goToPreviousCell(),
    // Backspace: deleteTableWhenAllCellsSelected,
    // 'Mod-Backspace': deleteTableWhenAllCellsSelected,
    // Delete: deleteTableWhenAllCellsSelected,
    // 'Mod-Delete': deleteTableWhenAllCellsSelected,
  }),

  // addHelpers: () => {
  //   return {
  //     deleteTable: () => {
  //       return true;
  //     },
  //   };
  // },
});
