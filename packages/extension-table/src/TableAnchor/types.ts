import type { ReactNode } from 'react';

export type TableAnchorItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  tableWidth: number;
  tableHeight: number;
} & (
  | {
      type: 'col';
      colIndex: number;
      rowIndex?: never;
    }
  | {
      type: 'row';
      rowIndex: number;
      colIndex?: never;
    }
);

export interface TableAnchorProps {
  children: ReactNode;
}
