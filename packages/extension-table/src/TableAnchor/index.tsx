import { AnchorDot } from './AnchorDot';
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
      <div className="wf-table-anchor-layer">
        {anchors.map((anchor) => (
          <AnchorDot
            anchor={anchor}
            key={`${anchor.type}-${anchor.colIndex ?? anchor.rowIndex}`}
          />
        ))}
      </div>
    </div>
  );
};

export type { TableAnchorItem, TableAnchorProps } from './types';
