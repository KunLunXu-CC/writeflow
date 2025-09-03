import { tableNodes } from 'prosemirror-tables';

export * from './cell';
export * from './header';
export * from './row';
export * from './table';

export const baseTableNodes = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {},
});
