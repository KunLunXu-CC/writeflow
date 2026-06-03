import type { MouseEvent, RefObject, ReactNode } from 'react';

export interface AnchorPoint {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: 'col' | 'row';
  colIndex?: number;
  rowIndex?: number;
}

export interface TableAnchorProps {
  children: ReactNode;
  tableRef: RefObject<HTMLTableElement | null>;
  onAnchorClick?: (anchor: AnchorPoint, event: MouseEvent<HTMLDivElement>) => void;
  showColAnchors?: boolean;
  showRowAnchors?: boolean;
}
