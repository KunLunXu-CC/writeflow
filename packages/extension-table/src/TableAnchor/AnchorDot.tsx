import { memo, useMemo, type CSSProperties } from 'react';
import type { TableAnchorItem } from './types';

interface AnchorDotProps {
  anchor: TableAnchorItem;
}

export const AnchorDot = memo(({ anchor }: AnchorDotProps) => {
  const showStartPoint = anchor.isFirst;

  const style = useMemo(
    () =>
      ({
        '--wf-table-anchor-x': `${anchor.x}px`,
        '--wf-table-anchor-y': `${anchor.y}px`,
        '--wf-table-anchor-width': `${anchor.width ?? 0}px`,
        '--wf-table-anchor-height': `${anchor.height ?? 0}px`,
        '--wf-table-anchor-table-width': `${anchor.tableWidth}px`,
        '--wf-table-anchor-table-height': `${anchor.tableHeight}px`,
      }) as CSSProperties,
    [anchor],
  );

  return (
    <div
      style={style}
      className={`wf-table-anchor-dot wf-table-anchor-dot-${anchor.type}`}>
      {showStartPoint ? (
        <div className="wf-table-anchor-dot-point wf-table-anchor-dot-point-start" />
      ) : null}
      <div className="wf-table-anchor-dot-point wf-table-anchor-dot-point-end" />
    </div>
  );
});

AnchorDot.displayName = 'AnchorDot';
