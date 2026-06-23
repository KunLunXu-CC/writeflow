import { memo, useMemo, type CSSProperties } from 'react';
import type { TableAnchorItem } from './types';
import clsx from 'clsx';

interface AnchorMarkerProps {
  anchor: TableAnchorItem;
}

export const AnchorMarker = memo(({ anchor }: AnchorMarkerProps) => {
  console.log('%c [ anchor ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', anchor);

  const style = useMemo(
    () =>
      ({
        '--wf-table-anchor-x': `${anchor.x}px`,
        '--wf-table-anchor-y': `${anchor.y}px`,
        '--wf-table-anchor-width': `${anchor.width}px`,
        '--wf-table-anchor-height': `${anchor.height}px`,
        '--wf-table-anchor-table-width': `${anchor.tableWidth}px`,
        '--wf-table-anchor-table-height': `${anchor.tableHeight}px`,
      }) as CSSProperties,
    [anchor],
  );

  return (
    <div
      style={style}
      className={clsx(`wf-table-anchor-marker wf-table-anchor-marker-${anchor.type}`, {
        'wf-table-anchor-marker-first': anchor.isFirst,
        'wf-table-anchor-marker-last': anchor.isLast,
      })}>
      <div
        style={style}
        className={clsx(`wf-table-anchor-dot wf-table-anchor-dot-${anchor.type}`, {
          'wf-table-anchor-dot-first': anchor.isFirst,
          'wf-table-anchor-dot-last': anchor.isLast,
        })}
      />
    </div>
  );
});

AnchorMarker.displayName = 'AnchorMarker';

//
