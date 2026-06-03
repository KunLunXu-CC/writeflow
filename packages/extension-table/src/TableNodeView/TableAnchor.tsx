import { useRef } from 'react';
import { AnchorDot } from './AnchorDot';
import { useTableAnchors } from './useTableAnchors';
import type { TableAnchorProps } from './types';

export const TableAnchor = ({
  children,
  tableRef,
  onAnchorClick,
  showColAnchors = true,
  showRowAnchors = true,
}: TableAnchorProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { anchors } = useTableAnchors(wrapperRef, tableRef, {
    showColAnchors,
    showRowAnchors,
  });

  return (
    <div
      ref={wrapperRef}
      className="wf-table-anchor">
      {children}
      <div className="wf-table-anchor-layer">
        {anchors.map((anchor) => (
          <AnchorDot
            key={anchor.id}
            anchor={anchor}
            onClick={onAnchorClick}
          />
        ))}
      </div>
    </div>
  );
};

export type { AnchorPoint, TableAnchorProps } from './types';
