import { memo, useCallback, useMemo, type CSSProperties, type MouseEvent } from 'react';
import type { AnchorPoint, TableAnchorProps } from './types';

interface AnchorDotProps {
  anchor: AnchorPoint;
  onClick?: TableAnchorProps['onAnchorClick'];
}

export const AnchorDot = memo(({ anchor, onClick }: AnchorDotProps) => {
  const showStartPoint = anchor.type === 'col' ? anchor.colIndex === 0 : anchor.rowIndex === 0;

  const style = useMemo(
    () =>
      ({
        '--wf-table-anchor-x': `${anchor.x}px`,
        '--wf-table-anchor-y': `${anchor.y}px`,
        '--wf-table-anchor-width': `${anchor.width ?? 0}px`,
        '--wf-table-anchor-height': `${anchor.height ?? 0}px`,
      }) as CSSProperties,
    [anchor.height, anchor.width, anchor.x, anchor.y],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick?.(anchor, event);
    },
    [anchor, onClick],
  );

  return (
    <div
      style={style}
      onClick={handleClick}
      className={`wf-table-anchor-dot wf-table-anchor-dot-${anchor.type}`}
    >
      {showStartPoint ? (
        <div className="wf-table-anchor-dot-point wf-table-anchor-dot-point-start" />
      ) : null}
      <div className="wf-table-anchor-dot-point wf-table-anchor-dot-point-end" />
    </div>
  );
});

AnchorDot.displayName = 'AnchorDot';
