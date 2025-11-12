import { WFCommand } from '../../types';
import { Selection } from 'prosemirror-state';

/**
 * 在下方插入段落
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertParagraphBelow: WFCommand = (writeFlow) => {
  if (!writeFlow.view) {
    return false;
  }
  const { state, dispatch } = writeFlow.view;
  const { selection } = state;
  const { paragraph: paragraphType } = state.schema.nodes;

  if (!paragraphType) {
    return false;
  }

  const { $from } = selection; // 获取当前选区所在节点的深度和位置
  const depth = $from.depth; // 当前位置的嵌套深度
  const insertPos = $from.after(depth); // 当前块级节点之后的位置
  const newParagraph = paragraphType.createAndFill(); // 创建一个新的空段落节点

  if (!newParagraph) {
    return false;
  }

  const tr = state.tr.insert(insertPos, newParagraph); // 创建事务: 在计算出的位置插入新段落
  const newSelection = Selection.near(tr.doc.resolve(insertPos + 1)); // 将光标移动到新插入段落的开始位置
  tr.setSelection(newSelection).scrollIntoView(); // 设置新的选区并滚动视图以确保可见

  dispatch(tr); // 应用事务

  return true;
};

/**
 * 在上方插入段落
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertParagraphAbove: WFCommand = (writeFlow) => {
  if (!writeFlow.view) {
    return false;
  }
  const { state, dispatch } = writeFlow.view;
  const { selection } = state;
  const { paragraph: paragraphType } = state.schema.nodes;

  if (!paragraphType) {
    return false;
  }

  const { $from } = selection; // 获取当前选区所在节点的深度和位置
  const depth = $from.depth; // 当前位置的嵌套深度
  const insertPos = $from.before(depth); // 当前块级节点之前的位置
  const newParagraph = paragraphType.createAndFill(); // 创建一个新的空段落节点

  if (!newParagraph) {
    return false;
  }

  const tr = state.tr.insert(insertPos, newParagraph); // 创建事务: 在计算出的位置插入新段落
  const newSelection = Selection.near(tr.doc.resolve(insertPos + 1)); // 将光标移动到新插入段落的开始位置
  tr.setSelection(newSelection).scrollIntoView(); // 设置新的选区并滚动视图以确保可见

  dispatch(tr); // 应用事务

  return true;
};
