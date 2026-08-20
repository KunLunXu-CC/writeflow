import {
  splitCell,
  mergeCells,
  addRowBefore,
  addRowAfter,
  addColumnBefore,
  addColumnAfter,
  deleteRow,
  deleteColumn,
  deleteTable,
  CellSelection,
  TableMap,
  selectionCell,
} from 'prosemirror-tables';
import type { Command, Selection } from 'prosemirror-state';
import { WFCommand } from '@kunlunxu/wf-core';
import { clamp } from './TableAnchor/utils';
import {
  getTableCellSelectionByIndex,
  getTableSelectionByIndex,
  getTableSelectionContext,
} from './helpers';

export interface SelectTableCellsOptions {
  rowIndex?: number;
  colIndex?: number;
  tablePos?: number;
}

/**
 * 合并选中的单元格
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 合并选中的单元格信息
 */
export const mergeTableCells: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return mergeCells(state, dispatch);
};

/**
 * 拆分合并的单元格
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 */
export const splitTableCell: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return splitCell(state, dispatch);
};

/**
 * 在当前行前插入行
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入行信息
 */
export const addTableRowBefore: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addRowBefore(state, dispatch);
};

/**
 * 在当前行后插入行
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入行信息
 */
export const addTableRowAfter: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addRowAfter(state, dispatch);
};

/**
 * 在当前列前插入列
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入列信息
 */
export const addTableColumnBefore: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addColumnBefore(state, dispatch);
};

/**
 * 在当前列后插入列
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入列信息
 */
export const addTableColumnAfter: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addColumnAfter(state, dispatch);
};

/**
 * 删除行
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 删除行信息
 */
export const deleteTableRow: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return deleteRow(state, dispatch);
};

/**
 * 删除列
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 删除列信息
 */
export const deleteTableColumn: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return deleteColumn(state, dispatch);
};

/**
 * 判断整行或整列选区中的单元格是否都为空。
 * 空单元格必须只包含一个空文本块，图片等非文本内容不会被视为空内容。
 */
const areSelectedTableCellsEmpty = (selection: CellSelection) => {
  let isEmpty = true;

  selection.forEachCell((cell) => {
    const content = cell.firstChild;

    if (cell.childCount !== 1 || !content?.isTextblock || content.childCount !== 0) {
      isEmpty = false;
    }
  });

  return isEmpty;
};

/**
 * 删除内容为空的整行或整列选区。
 * 仅剩一行或一列时删除整张表，其他整表选区交给后续删除逻辑处理。
 */
export const deleteEmptySelectedTableRowOrColumn: Command = (state, dispatch) => {
  const { selection } = state;

  if (!(selection instanceof CellSelection)) {
    return false;
  }

  const isRowSelection = selection.isRowSelection();
  const isColSelection = selection.isColSelection();

  if ((!isRowSelection && !isColSelection) || !areSelectedTableCellsEmpty(selection)) {
    return false;
  }

  if (isRowSelection && isColSelection) {
    const table = selection.$anchorCell.node(-1);
    const tableMap = TableMap.get(table);

    return tableMap.height === 1 || tableMap.width === 1 ? deleteTable(state, dispatch) : false;
  }

  return isRowSelection ? deleteRow(state, dispatch) : deleteColumn(state, dispatch);
};

/**
 * 根据行列索引选中表格单元格；只传行或列时选中整行或整列，未传索引时选中当前单元格
 */
export const selectTableCells: WFCommand<SelectTableCellsOptions> = (
  { writeFlow, extension },
  options = {},
) => {
  const { dispatch, state } = writeFlow;
  const tableContext = getTableSelectionContext(
    { writeFlow, extension },
    { tablePos: options.tablePos },
  );

  if (!tableContext) {
    return false;
  }

  const tableMap = TableMap.get(tableContext.tableNode);
  const hasRowIndex = options.rowIndex !== undefined;
  const hasColIndex = options.colIndex !== undefined;
  const row = hasRowIndex ? clamp(options.rowIndex!, tableMap.height - 1) : 0;
  const col = hasColIndex ? clamp(options.colIndex!, tableMap.width - 1) : 0;
  let selection: Selection;

  if (hasRowIndex && hasColIndex) {
    selection = getTableCellSelectionByIndex({
      row,
      col,
      tableMap,
      doc: state.doc,
      tableNode: tableContext.tableNode,
      tableStart: tableContext.tableStart,
    });
  } else if (hasRowIndex) {
    selection = getTableSelectionByIndex({
      row,
      tableMap,
      col: 0,
      type: 'row',
      doc: state.doc,
      tableStart: tableContext.tableStart,
      tableNode: tableContext.tableNode,
    });
  } else if (hasColIndex) {
    selection = getTableSelectionByIndex({
      col,
      row: 0,
      tableMap,
      type: 'col',
      doc: state.doc,
      tableStart: tableContext.tableStart,
      tableNode: tableContext.tableNode,
    });
  } else {
    selection =
      options.tablePos === undefined
        ? CellSelection.create(state.doc, selectionCell(state).pos)
        : getTableCellSelectionByIndex({
            row: 0,
            col: 0,
            tableMap,
            doc: state.doc,
            tableNode: tableContext.tableNode,
            tableStart: tableContext.tableStart,
          });
  }

  dispatch(state.tr.setSelection(selection));

  return true;
};
