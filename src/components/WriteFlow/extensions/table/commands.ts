import {
  mergeCells,
  addRowAfter,
  addColumnAfter,
  deleteRow,
  deleteColumn,
} from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';

/**
 * 合并选中的单元格
 * @param view - 编辑器视图
 * @returns 合并选中的单元格信息
 */
export const mergeTableCells = (view: EditorView | null): boolean => {
  if (!view) {
    return false;
  }

  return mergeCells(view.state, view.dispatch);
};

/**
 * 插入行
 * @param view - 编辑器视图
 * @returns 插入行信息
 */
export const addTableRowAfter = (view: EditorView | null): boolean => {
  if (!view) {
    return false;
  }

  return addRowAfter(view.state, view.dispatch);
};

/**
 * 插入列
 * @param view - 编辑器视图
 * @returns 插入列信息
 */
export const addTableColumnAfter = (view: EditorView | null): boolean => {
  if (!view) {
    return false;
  }

  return addColumnAfter(view.state, view.dispatch);
};

/**
 * 删除行
 * @param view - 编辑器视图
 * @returns 删除行信息
 */
export const deleteTableRow = (view: EditorView | null): boolean => {
  if (!view) {
    return false;
  }

  return deleteRow(view.state, view.dispatch);
};

/**
 * 删除列
 * @param view - 编辑器视图
 * @returns 删除列信息
 */
export const deleteTableColumn = (view: EditorView | null): boolean => {
  if (!view) {
    return false;
  }

  return deleteColumn(view.state, view.dispatch);
};
