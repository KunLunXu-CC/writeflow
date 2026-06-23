import { AnchorMarker } from './AnchorMarker';
import { useTableAnchors } from './useTableAnchors';
import type { TableAnchorProps } from './types';
import './index.scss';

export const TableAnchor = ({ children }: TableAnchorProps) => {
  const { anchors, wrapperRef } = useTableAnchors();

  return (
    <div
      ref={wrapperRef}
      className="wf-table-anchor">
      {children}
      {anchors.map((anchor) => (
        <AnchorMarker
          anchor={anchor}
          key={`${anchor.type}-${anchor.colIndex ?? anchor.rowIndex}`}
        />
      ))}
    </div>
  );
};

export type { TableAnchorItem, TableAnchorProps } from './types';
