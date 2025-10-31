import { CellSelection } from 'prosemirror-tables';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export interface SelectedCell {
  node: Node;
  pos: number;
}

/**
 * 获取选中的单元格
 * @param view - 编辑器视图
 * @returns 获取选中的单元格信息
 */
export const getTableSelectedCells = (
  view: EditorView | null,
): SelectedCell[] => {
  if (!view) return [];

  const { selection } = view.state;

  const isSelected = selection instanceof CellSelection;

  if (!isSelected) return [];

  const cells: { node: Node; pos: number }[] = [];

  selection.forEachCell((cell, pos) => {
    cells.push({ node: cell, pos });
  });

  return cells;
};
