import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';
import { DOMOutputSpec } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
// import { tableEditing } from 'prosemirror-tables';

const ROW_COUNT_INPUT_RULE = 2;
const COL_COUNT_INPUT_RULE = 3;

export const Table = Node.create({
  name: 'table',

  // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
  // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
  addSchema: () => {
    return {
      content: 'tableRow+',

      tableRole: 'table',

      isolating: true,

      group: 'block',

      toDOM() {
        const table: DOMOutputSpec = [
          'table',
          {}, // style: tableWidth ? `width: ${tableWidth}` : `min-width: ${tableMinWidth}`,
          [
            'colgroup',
            {},
            [
              'col',
              {}, // style: `${property}: ${value}`
            ],
          ],
          ['tbody', 0],
        ];
        return table;
      },
    };
  },

  addInputRules: ({ schema }) => {
    return [
      new InputRule(/^\|-\s$/, (state, match, start, end) => {
        const cellNodes = Array.from(
          { length: COL_COUNT_INPUT_RULE },
          () => schema.nodes.tableCell.createAndFill()!,
        );

        const rowNodes = Array.from(
          { length: ROW_COUNT_INPUT_RULE },
          () => schema.nodes.tableRow.createAndFill(null, cellNodes)!,
        );

        const tableNode = schema.nodes.table.createAndFill(null, rowNodes)!;
        const tr = state.tr.delete(start, end).replaceSelectionWith(tableNode);
        return tr.setSelection(TextSelection.create(tr.doc, start));
      }),
    ];
  },

  // getPlugins: () => {
  //   return [tableEditing()];
  //   // return [columnResizing(), tableEditing()];
  // },
});
