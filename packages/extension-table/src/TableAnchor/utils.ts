import type { Node as ProseMirrorNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { getTableSelectionByIndex } from '../helpers';
import type { TableAnchorItem, TableAnchorProps } from './types';

export const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

export interface TableContext {
  tablePos: number;
  tableNode: ProseMirrorNode;
  tableMap: TableMap;
  tableStart: number;
}

export interface TableAnchorInsertTarget {
  isBefore: boolean;
  targetRow: number;
  targetCol: number;
}

export const getTableContext = (doc: ProseMirrorNode, getPos: TableAnchorProps['getPos']) => {
  const tablePos = getPos();

  if (tablePos === undefined) {
    return null;
  }

  const tableNode = doc.nodeAt(tablePos);

  if (!tableNode) {
    return null;
  }

  return {
    tablePos,
    tableNode,
    tableMap: TableMap.get(tableNode),
    tableStart: tablePos + 1,
  };
};

export const getTableAnchorInsertTarget = (
  anchor: TableAnchorItem,
  { tableMap }: TableContext,
): TableAnchorInsertTarget => ({
  isBefore: anchor.type === 'col' ? anchor.colIndex === 0 : anchor.rowIndex === 0,
  targetRow: anchor.type === 'row' ? clamp(anchor.rowIndex - 1, tableMap.height - 1) : 0,
  targetCol: anchor.type === 'col' ? clamp(anchor.colIndex - 1, tableMap.width - 1) : 0,
});

export const getTableAnchorInsertSelection = (
  doc: ProseMirrorNode,
  anchor: TableAnchorItem,
  tableContext: TableContext,
  { targetRow, targetCol }: TableAnchorInsertTarget,
) =>
  getTableSelectionByIndex({
    doc,
    type: anchor.type,
    tableStart: tableContext.tableStart,
    tableMap: tableContext.tableMap,
    tableNode: tableContext.tableNode,
    row: targetRow,
    col: targetCol,
  });

export const getTableAnchorInsertCommand = (
  commands: TableAnchorProps['writeFlow']['commands'],
  anchor: TableAnchorItem,
  { isBefore }: TableAnchorInsertTarget,
) =>
  anchor.type === 'col'
    ? isBefore
      ? commands.addTableColumnBefore
      : commands.addTableColumnAfter
    : isBefore
      ? commands.addTableRowBefore
      : commands.addTableRowAfter;

export const getInsertedTableAnchorFocusSelection = (
  doc: ProseMirrorNode,
  anchor: TableAnchorItem,
  tableStart: number,
  tableNode: ProseMirrorNode,
  { targetRow, targetCol }: TableAnchorInsertTarget,
) => {
  const tableMap = TableMap.get(tableNode);
  const focusRow = anchor.type === 'row' ? clamp(anchor.rowIndex, tableMap.height - 1) : targetRow;
  const focusCol = anchor.type === 'col' ? clamp(anchor.colIndex, tableMap.width - 1) : targetCol;
  const focusCellPos = getCellPos(tableStart, tableMap, tableNode, focusRow, focusCol);

  return Selection.near(doc.resolve(focusCellPos + 1));
};

export const getCellPos = (
  tableStart: number,
  tableMap: TableMap,
  tableNode: ProseMirrorNode,
  row: number,
  col: number,
) => tableStart + tableMap.positionAt(row, col, tableNode);
