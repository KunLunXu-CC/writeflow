import { useCallback } from 'react';
import { AnchorMarker } from './AnchorMarker';
import { useTableAnchors } from './useTableAnchors';
import type { TableAnchorItem, TableAnchorProps } from './types';
import {
  getInsertedTableAnchorFocusSelection,
  getTableAnchorInsertCommand,
  getTableAnchorInsertSelection,
  getTableAnchorInsertTarget,
  getTableContext,
} from './utils';
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

      if (anchor.type === 'col') {
        writeFlow.commands.selectTableCells({ colIndex: anchor.colIndex, tablePos });
      } else {
        writeFlow.commands.selectTableCells({ rowIndex: anchor.rowIndex, tablePos });
      }

      view.focus();
    },
    [getPos, writeFlow],
  );

  const handleDotClick = useCallback(
    (anchor: TableAnchorItem) => {
      const { view } = writeFlow;
      const tableContext = getTableContext(view.state.doc, getPos);

      if (!tableContext) {
        return;
      }

      const { tablePos, tableStart } = tableContext;
      const insertTarget = getTableAnchorInsertTarget(anchor, tableContext);
      const selection = getTableAnchorInsertSelection(
        view.state.doc,
        anchor,
        tableContext,
        insertTarget,
      );
      const command = getTableAnchorInsertCommand(writeFlow.commands, anchor, insertTarget);

      view.dispatch(view.state.tr.setSelection(selection));

      const isInserted = command();

      if (!isInserted) {
        return;
      }

      const nextTableNode = view.state.doc.nodeAt(tablePos);

      if (!nextTableNode) {
        return;
      }

      const focusSelection = getInsertedTableAnchorFocusSelection(
        view.state.doc,
        anchor,
        tableStart,
        nextTableNode,
        insertTarget,
      );

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
