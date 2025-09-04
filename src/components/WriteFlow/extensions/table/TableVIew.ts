import { Node } from 'prosemirror-model';
import { NodeView, ViewMutationRecord } from 'prosemirror-view';
import { updateColumnsOnResize } from 'prosemirror-tables';

/**
 * see: https://github.com/ProseMirror/prosemirror-tables/blob/master/src/tableview.ts
 */
export class TableView implements NodeView {
  public dom: HTMLDivElement;
  public table: HTMLTableElement;
  public colgroup: HTMLTableColElement;
  public contentDOM: HTMLTableSectionElement;

  constructor(
    public node: Node,
    public defaultCellMinWidth: number,
  ) {
    this.dom = document.createElement('div');
    this.dom.className = 'writer-flow-table';
    this.table = this.dom.appendChild(document.createElement('table'));
    this.colgroup = this.table.appendChild(document.createElement('colgroup'));
    this.contentDOM = this.table.appendChild(document.createElement('tbody'));

    this.table.style.setProperty(
      '--default-cell-min-width',
      `${defaultCellMinWidth}px`,
    );

    updateColumnsOnResize(node, this.colgroup, this.table, defaultCellMinWidth);
  }

  update(node: Node): boolean {
    if (node.type != this.node.type) return false;
    this.node = node;
    updateColumnsOnResize(
      node,
      this.colgroup,
      this.table,
      this.defaultCellMinWidth,
    );
    return true;
  }

  ignoreMutation(record: ViewMutationRecord): boolean {
    return (
      record.type == 'attributes' &&
      (record.target == this.table || this.colgroup.contains(record.target))
    );
  }
}
