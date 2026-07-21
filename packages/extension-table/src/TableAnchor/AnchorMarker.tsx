import { Plus } from 'lucide-react';
import type { TableAnchorItem } from './types';
import { memo, useMemo, useCallback, type CSSProperties, type MouseEvent } from 'react';

interface AnchorMarkerProps {
  anchor: TableAnchorItem;
  onDotClick: (anchor: TableAnchorItem) => void;
  onMarkerClick: (anchor: TableAnchorItem) => void;
}

export const AnchorMarker = memo(({ anchor, onDotClick, onMarkerClick }: AnchorMarkerProps) => {
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

  const handleDotClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDotClick(anchor);
    },
    [anchor, onDotClick],
  );

  const handleMarkerClick = useCallback(() => {
    onMarkerClick(anchor);
  }, [anchor, onMarkerClick]);

  return (
    <div
      style={style}
      onClick={handleMarkerClick}
      className={`wf-table-anchor-marker wf-table-anchor-marker-${anchor.type}`}>
      <button
        type="button"
        onClick={handleDotClick}
        className={`wf-table-anchor-dot wf-table-anchor-dot-${anchor.type}`}>
        <div className="wf-table-anchor-dot-inner">
          <Plus />
        </div>
      </button>
    </div>
  );
});

AnchorMarker.displayName = 'AnchorMarker';
