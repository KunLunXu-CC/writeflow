import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { AnchorPoint } from './types';

interface UseTableAnchorsOptions {
  showColAnchors?: boolean;
  showRowAnchors?: boolean;
}

export function useTableAnchors(
  wrapperRef: RefObject<HTMLDivElement | null>,
  tableRef: RefObject<HTMLTableElement | null>,
  { showColAnchors = true, showRowAnchors = true }: UseTableAnchorsOptions = {},
) {
  const [anchors, setAnchors] = useState<AnchorPoint[]>([]);
  const rafRef = useRef<number>(undefined);

  const calculate = useCallback(() => {
    const wrapper = wrapperRef.current;
    const table = tableRef.current;

    if (!wrapper || !table) {
      setAnchors([]);
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    const points: AnchorPoint[] = [];
    const tableTop = tableRect.top - wrapperRect.top;

    if (showColAnchors) {
      const firstRow = table.rows[0];

      if (firstRow) {
        Array.from(firstRow.cells).forEach((cell, index) => {
          const cellRect = cell.getBoundingClientRect();

          points.push({
            id: `col-${index}`,
            x: cellRect.left - wrapperRect.left,
            y: tableTop,
            width: cellRect.width,
            type: 'col',
            colIndex: index,
          });
        });
      }
    }

    if (showRowAnchors) {
      Array.from(table.rows).forEach((row, index) => {
        const rowRect = row.getBoundingClientRect();

        points.push({
          id: `row-${index}`,
          x: tableRect.left - wrapperRect.left,
          y: rowRect.top - wrapperRect.top,
          height: rowRect.height,
          type: 'row',
          rowIndex: index,
        });
      });
    }

    setAnchors(points);
  }, [showColAnchors, showRowAnchors, tableRef, wrapperRef]);

  const scheduleCalculate = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(calculate);
  }, [calculate]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const table = tableRef.current;

    if (!wrapper || !table) {
      return;
    }

    calculate();

    const resizeObserver = new ResizeObserver(scheduleCalculate);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(table);

    const mutationObserver = new MutationObserver(scheduleCalculate);
    mutationObserver.observe(table, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'width', 'height', 'colspan', 'rowspan', 'class'],
    });

    window.addEventListener('resize', scheduleCalculate);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', scheduleCalculate);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculate, scheduleCalculate, tableRef, wrapperRef]);

  return { anchors, recalculate: calculate };
}
