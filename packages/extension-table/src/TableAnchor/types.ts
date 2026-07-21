import type { ReactNode } from 'react';
import type { WriteFlow } from '@kunlunxu/wf-core';

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
  getPos: () => number | undefined;
  writeFlow: WriteFlow;
}
