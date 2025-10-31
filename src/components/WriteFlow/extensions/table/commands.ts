import { mergeCells } from 'prosemirror-tables';
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
