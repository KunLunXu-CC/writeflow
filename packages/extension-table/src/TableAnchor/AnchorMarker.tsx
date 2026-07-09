import { memo, useMemo, type CSSProperties } from 'react';
import { Plus } from 'lucide-react';
import type { TableAnchorItem } from './types';

interface AnchorMarkerProps {
  anchor: TableAnchorItem;
}

export const AnchorMarker = memo(({ anchor }: AnchorMarkerProps) => {
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
      className={`wf-table-anchor-marker wf-table-anchor-marker-${anchor.type}`}>
      <div
        style={style}
        className={`wf-table-anchor-dot wf-table-anchor-dot-${anchor.type}`}>
        <div className="wf-table-anchor-dot-inner">
          <Plus />
        </div>
      </div>
    </div>
  );
});

AnchorMarker.displayName = 'AnchorMarker';
