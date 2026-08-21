import { useLayoutEffect, useRef } from 'react';
import { WFNodeView, type WFNodeViewProps, type WriteFlow } from '@kunlunxu/wf-core';
import { updateColumnsOnResize } from 'prosemirror-tables';
import type { Node as PMNode } from 'prosemirror-model';
import { TableAnchor } from '../TableAnchor';
import './index.scss';

export const DEFAULT_CELL_MIN_WIDTH = 100;

export const TableNodeViewComponent = ({ getPos, nodeView }: WFNodeViewProps) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const colgroupRef = useRef<HTMLTableColElement>(null);
  const contentRef = useRef<HTMLTableSectionElement>(null);
  const tableNodeView = nodeView as TableNodeView;

  useLayoutEffect(() => {
    const table = tableRef.current;
    const colgroup = colgroupRef.current;
    const contentDOM = contentRef.current;

    if (!table || !colgroup || !contentDOM) {
      return;
    }

    tableNodeView.mountTableDOM(table, colgroup, contentDOM);

    return () => tableNodeView.unmountTableDOM();
  }, [nodeView, tableNodeView]);

  return (
    <TableAnchor
      getPos={getPos}
      writeFlow={tableNodeView.writeFlow}>
      <table ref={tableRef}>
        <colgroup ref={colgroupRef} />
        <tbody ref={contentRef} />
      </table>
    </TableAnchor>
  );
};

export class TableNodeView extends WFNodeView {
  public static component = TableNodeViewComponent;

  private table?: HTMLTableElement;
  private colgroup?: HTMLTableColElement;

  public mountTableDOM(
    table: HTMLTableElement,
    colgroup: HTMLTableColElement,
    contentDOM: HTMLTableSectionElement,
  ) {
    this.table = table;
    this.colgroup = colgroup;
    this.contentDOM = contentDOM;
    this.dom.classList.add('wf-table');
    this.updateColumns(this.node);
  }

  public unmountTableDOM() {
    this.table = undefined;
    this.colgroup = undefined;
    this.contentDOM = undefined;
  }

  public override update(node: PMNode): boolean {
    if (!super.update(node)) {
      return false;
    }

    this.updateColumns(node);
    return true;
  }

  private updateColumns(node: PMNode) {
    if (!this.table || !this.colgroup) {
      return;
    }

    updateColumnsOnResize(node, this.colgroup, this.table, DEFAULT_CELL_MIN_WIDTH);
  }

  public get writeFlow(): WriteFlow {
    return this.context.writeFlow;
  }
}
