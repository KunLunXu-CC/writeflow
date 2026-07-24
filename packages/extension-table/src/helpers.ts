import { CellSelection, findTable, TableMap } from 'prosemirror-tables';
import type { Node } from 'prosemirror-model';
import type { Selection } from 'prosemirror-state';
import { WFHelper } from '@kunlunxu/wf-core';
import type { TableAnchorItem } from './TableAnchor/types';

export interface SelectedCell {
  node: Node;
  pos: number;
}

export interface TableSelectionContext {
  tableNode: Node;
  tableStart: number;
}

export interface GetTableSelectionContextOptions {
  tablePos?: number;
}

export interface GetTableSelectionByIndexOptions {
  doc: Node;
  type: TableAnchorItem['type'];
  tableStart: number;
  tableMap: TableMap;
  tableNode: Node;
  row: number;
  col: number;
}

export interface GetTableCellSelectionByIndexOptions {
  doc: Node;
  tableStart: number;
  tableMap: TableMap;
  tableNode: Node;
  row: number;
  col: number;
}

const getCellPos = ({
  row,
  col,
  tableMap,
  tableNode,
  tableStart,
}: Omit<GetTableCellSelectionByIndexOptions, 'doc'>) =>
  tableStart + tableMap.positionAt(row, col, tableNode);

/**
 * 获取表格选择上下文。
 * 传入 tablePos 时定位指定表格，否则定位当前光标所在表格。
 */
export const getTableSelectionContext: WFHelper<
  TableSelectionContext | null,
  GetTableSelectionContextOptions
> = ({ writeFlow }, options = {}) => {
  const { state } = writeFlow;
  const { tablePos } = options;

  if (tablePos !== undefined) {
    const tableNode = state.doc.nodeAt(tablePos);

    if (!tableNode) {
      return null;
    }

    return {
      tableNode,
      tableStart: tablePos + 1,
    };
  }

  const table = findTable(state.selection.$from);

  if (!table) {
    return null;
  }

  return {
    tableNode: table.node,
    tableStart: table.start,
  };
};

/**
 * 根据行列索引获取整行或整列选择。
 */
export const getTableSelectionByIndex = ({
  doc,
  type,
  tableStart,
  tableMap,
  tableNode,
  row,
  col,
}: GetTableSelectionByIndexOptions): Selection => {
  const $cell = doc.resolve(
    getCellPos({
      row,
      col,
      tableMap,
      tableNode,
      tableStart,
    }),
  );

  return type === 'col' ? CellSelection.colSelection($cell) : CellSelection.rowSelection($cell);
};

/**
 * 根据行列索引获取单个单元格选择。
 */
export const getTableCellSelectionByIndex = ({
  doc,
  tableStart,
  tableMap,
  tableNode,
  row,
  col,
}: GetTableCellSelectionByIndexOptions): CellSelection =>
  CellSelection.create(
    doc,
    getCellPos({
      row,
      col,
      tableMap,
      tableNode,
      tableStart,
    }),
  );

/**
 * 获取当前选中的表格单元格。
 */
export const getTableSelectedCells: WFHelper<SelectedCell[]> = ({ writeFlow }) => {
  const { state } = writeFlow;

  const { selection } = state;

  const isSelected = selection instanceof CellSelection;

  if (!isSelected) return [];

  const cells: { node: Node; pos: number }[] = [];

  selection.forEachCell((cell, pos) => {
    cells.push({ node: cell, pos });
  });

  return cells;
};
