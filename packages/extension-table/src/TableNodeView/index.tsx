import { useLayoutEffect, useRef } from 'react';
import { WFNodeView, type WFNodeViewProps } from '@kunlunxu/wf-core';
import { updateColumnsOnResize } from 'prosemirror-tables';
import { TableAnchor } from './TableAnchor';
import './index.scss';

export const DEFAULT_CELL_MIN_WIDTH = 100;

export const TableNodeViewComponent = ({ node, nodeView }: WFNodeViewProps) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const colgroupRef = useRef<HTMLTableColElement>(null);
  const contentRef = useRef<HTMLTableSectionElement>(null);

  useLayoutEffect(() => {
    const table = tableRef.current;
    const colgroup = colgroupRef.current;
    const contentDOM = contentRef.current;

    if (!table || !colgroup || !contentDOM) {
      return;
    }

    nodeView.contentDOM = contentDOM;
    nodeView.dom.classList.add('wf-table');

    updateColumnsOnResize(node, colgroup, table, DEFAULT_CELL_MIN_WIDTH);
  }, [node, nodeView]);

  return (
    <TableAnchor tableRef={tableRef}>
      <table ref={tableRef}>
        <colgroup ref={colgroupRef} />
        <tbody ref={contentRef} />
      </table>
    </TableAnchor>
  );
};

export class TableNodeView extends WFNodeView {
  public static component = TableNodeViewComponent;
}
