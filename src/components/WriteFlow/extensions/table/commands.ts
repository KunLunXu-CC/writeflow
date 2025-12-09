import {
  mergeCells,
  addRowAfter,
  addColumnAfter,
  deleteRow,
  deleteColumn,
} from 'prosemirror-tables';
import { WFCommand } from '../../types';

/**
 * 合并选中的单元格
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 合并选中的单元格信息
 */
export const mergeTableCells: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return mergeCells(state, dispatch);
};

/**
 * 插入行
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入行信息
 */
export const addTableRowAfter: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addRowAfter(state, dispatch);
};

/**
 * 插入列
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 插入列信息
 */
export const addTableColumnAfter: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return addColumnAfter(state, dispatch);
};

/**
 * 删除行
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 删除行信息
 */
export const deleteTableRow: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return deleteRow(state, dispatch);
};

/**
 * 删除列
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @returns 删除列信息
 */
export const deleteTableColumn: WFCommand = ({ writeFlow }) => {
  const { dispatch, state } = writeFlow;

  return deleteColumn(state, dispatch);
};
