import { baseTableNodes } from '.';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';
import { TextSelection } from 'prosemirror-state';
import { goToNextCell, tableEditing } from 'prosemirror-tables';
// import { TableView } from './TableVIew';
// import { tableEditing } from 'prosemirror-tables';
// columnResizing,

const ROW_COUNT_INPUT_RULE = 2;
const COL_COUNT_INPUT_RULE = 3;

export const Table = Node.create({
  name: 'table',

  addSchema: () => {
    return baseTableNodes.table;
  },

  addInputRules: ({ schema }) => {
    return [
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
    ];
  },

  addKeymap: () => {
    return {
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
    };
  },

  addPlugins: () => {
    // columnResizing,
    return [tableEditing()];
  },
});
