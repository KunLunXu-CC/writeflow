import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { TableAnchorItem } from './types';

// 复用同一个空数组引用，避免空状态下产生新引用而触发无意义的重渲染。
const EMPTY_ANCHORS: TableAnchorItem[] = [];

// 监听表格结构与尺寸相关变化：节点增删、影响布局的样式与跨行跨列属性。
const TABLE_MUTATION_OBSERVER_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'width', 'height', 'colspan', 'rowspan', 'class'],
};

/**
 * 根据表格首行单元格与所有行的真实 DOM 尺寸，计算列、行锚点信息。
 * 所有坐标均相对于 wrapper 容器的左上角。
 */
const getTable = (wrapper?: HTMLDivElement | null) => wrapper?.querySelector('table');

const computeAnchors = (wrapper: HTMLDivElement): TableAnchorItem[] => {
  const table = getTable(wrapper);

  if (!table) {
    return EMPTY_ANCHORS;
  }

  const {
    top: tableTop,
    left: tableLeft,
    width: tableWidth,
    height: tableHeight,
  } = wrapper.getBoundingClientRect();

  const anchors: TableAnchorItem[] = [];

  const { rows } = table; // 行锚点：以每一行的纵向位置为基准。
  const firstRow = rows[0]; // 列锚点：以首行各单元格的横向位置为基准。

  // 列: 根据首行单元格位置计算列锚点
  if (firstRow) {
    const { cells } = firstRow;

    for (let colIndex = 0; colIndex < cells.length; colIndex += 1) {
      const { [colIndex]: cell } = cells;
      const cellRect = cell.getBoundingClientRect();

      anchors.push({
        colIndex,
        tableWidth,
        tableHeight,

        type: 'col',
        isFirst: colIndex === 0,
        isLast: colIndex === cells.length - 1,

        y: 0,
        x: cellRect.left - tableLeft,

        width: cellRect.width,
        height: cellRect.height,
      });
    }
  }

  // 行: 根据每行位置计算行锚点
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const { [rowIndex]: row } = rows;
    const rowRect = row.getBoundingClientRect();

    anchors.push({
      rowIndex,
      tableWidth,
      tableHeight,

      type: 'row',
      isFirst: rowIndex === 0,
      isLast: rowIndex === rows.length - 1,

      x: 0,
      y: rowRect.top - tableTop,

      width: rowRect.width,
      height: rowRect.height,
    });
  }

  return anchors;
};

export const useTableAnchors = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<TableAnchorItem[]>(EMPTY_ANCHORS);
  const rafRef = useRef<number | null>(null);

  // 通过 requestAnimationFrame 合并同一帧内的多次触发，避免布局抖动时重复计算。
  const recalculate = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const wrapper = wrapperRef.current;

      if (!wrapper) {
        return;
      }

      setAnchors(computeAnchors(wrapper));
    });
  }, []);

  // 表格锚点依赖真实 DOM 尺寸，布局完成后初始化并持续监听容器尺寸、表格结构变化。
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const table = getTable(wrapper);

    if (!table || !wrapper) {
      return;
    }

    recalculate();

    const resizeObserver = new ResizeObserver(recalculate);
    resizeObserver.observe(wrapper);

    const mutationObserver = new MutationObserver(recalculate);
    mutationObserver.observe(table, TABLE_MUTATION_OBSERVER_OPTIONS);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [recalculate]);

  return { anchors, wrapperRef, recalculate };
};
