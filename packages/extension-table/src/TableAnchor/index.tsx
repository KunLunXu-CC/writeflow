import { useCallback } from 'react';
import { CellSelection, TableMap } from 'prosemirror-tables';
import { Selection } from 'prosemirror-state';
import { AnchorMarker } from './AnchorMarker';
import { useTableAnchors } from './useTableAnchors';
import type { TableAnchorItem, TableAnchorProps } from './types';
import './index.scss';

export const TableAnchor = ({ children, getPos, writeFlow }: TableAnchorProps) => {
  const { anchors, wrapperRef } = useTableAnchors();

  const handleMarkerClick = useCallback(
    (anchor: TableAnchorItem) => {
      const { view } = writeFlow;
      const tablePos = getPos();

      if (tablePos === undefined) {
        return;
      }

      const tableNode = view.state.doc.nodeAt(tablePos);

      if (!tableNode) {
        return;
      }

      const tableMap = TableMap.get(tableNode);
      const tableStart = tablePos + 1;
      const row = anchor.type === 'row' ? Math.min(anchor.rowIndex, tableMap.height - 1) : 0;
      const col = anchor.type === 'col' ? Math.min(anchor.colIndex, tableMap.width - 1) : 0;
      const cellPos = tableStart + tableMap.positionAt(row, col, tableNode);
      const selection =
        anchor.type === 'col'
          ? CellSelection.colSelection(view.state.doc.resolve(cellPos))
          : CellSelection.rowSelection(view.state.doc.resolve(cellPos));

      view.dispatch(view.state.tr.setSelection(selection));
      view.focus();
    },
    [getPos, writeFlow],
  );

  const handleDotClick = useCallback(
    (anchor: TableAnchorItem) => {
      const { view } = writeFlow;
      const tablePos = getPos();

      if (tablePos === undefined) {
        return;
      }

      const tableNode = view.state.doc.nodeAt(tablePos);

      if (!tableNode) {
        return;
      }

      const tableMap = TableMap.get(tableNode);
      const tableStart = tablePos + 1;
      const isBefore = anchor.type === 'col' ? anchor.colIndex === 0 : anchor.rowIndex === 0;
      const targetRow =
        anchor.type === 'row' ? Math.min(Math.max(anchor.rowIndex - 1, 0), tableMap.height - 1) : 0;
      const targetCol =
        anchor.type === 'col' ? Math.min(Math.max(anchor.colIndex - 1, 0), tableMap.width - 1) : 0;
      const cellPos = tableStart + tableMap.positionAt(targetRow, targetCol, tableNode);
      const selection =
        anchor.type === 'col'
          ? CellSelection.colSelection(view.state.doc.resolve(cellPos))
          : CellSelection.rowSelection(view.state.doc.resolve(cellPos));
      const command =
        anchor.type === 'col'
          ? isBefore
            ? writeFlow.commands.addTableColumnBefore
            : writeFlow.commands.addTableColumnAfter
          : isBefore
            ? writeFlow.commands.addTableRowBefore
            : writeFlow.commands.addTableRowAfter;

      view.dispatch(view.state.tr.setSelection(selection));

      const isInserted = command();

      if (!isInserted) {
        return;
      }

      const nextTableNode = view.state.doc.nodeAt(tablePos);

      if (!nextTableNode) {
        return;
      }

      const nextTableMap = TableMap.get(nextTableNode);
      const focusRow =
        anchor.type === 'row'
          ? Math.min(anchor.rowIndex, nextTableMap.height - 1)
          : Math.min(targetRow, nextTableMap.height - 1);
      const focusCol =
        anchor.type === 'col'
          ? Math.min(anchor.colIndex, nextTableMap.width - 1)
          : Math.min(targetCol, nextTableMap.width - 1);
      const focusCellPos = tableStart + nextTableMap.positionAt(focusRow, focusCol, nextTableNode);
      const focusSelection = Selection.near(view.state.doc.resolve(focusCellPos + 1));

      view.dispatch(view.state.tr.setSelection(focusSelection));
      view.focus();
    },
    [getPos, writeFlow],
  );

  return (
    <div
      ref={wrapperRef}
      className="wf-table-anchor">
      {children}
      {anchors.map((anchor) => (
        <AnchorMarker
          anchor={anchor}
          onDotClick={handleDotClick}
          onMarkerClick={handleMarkerClick}
          key={`${anchor.type}-${anchor.colIndex ?? anchor.rowIndex}`}
        />
      ))}
    </div>
  );
};

export type { TableAnchorItem, TableAnchorProps } from './types';
