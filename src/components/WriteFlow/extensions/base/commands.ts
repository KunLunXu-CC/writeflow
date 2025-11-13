import { redo as pmRedo, undo as pmUndo } from 'prosemirror-history';
import { WFCommand } from '../../types';

/**
 * 重做命令
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const redo: WFCommand = (writeFlow) => {
  const { state, dispatch } = writeFlow;

  return pmRedo(state, dispatch);
};

/**
 * 撤销命令
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const undo: WFCommand = (writeFlow) => {
  const { state, dispatch } = writeFlow;

  return pmUndo(state, dispatch);
};
