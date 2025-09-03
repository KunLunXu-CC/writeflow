import type { NodeView } from 'prosemirror-view';

export class TableView implements NodeView {
  dom: HTMLTableElement;
  contentDOM: HTMLTableSectionElement;

  constructor() {
    const table = document.createElement('table');
    table.classList.add('writer-flow-table');

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    this.dom = table;
    this.contentDOM = tbody;
  }
}
