import { redo as pmRedo, undo as pmUndo } from 'prosemirror-history';
import { WFCommand } from '../../types';

/**
 * 重做命令
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const redo: WFCommand = (writeFlow) => {
  if (!writeFlow.view) {
    return false;
  }

  return pmRedo(writeFlow.view.state, writeFlow.view.dispatch);
};

/**
 * 撤销命令
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const undo: WFCommand = (writeFlow) => {
  if (!writeFlow.view) {
    return false;
  }

  return pmUndo(writeFlow.view.state, writeFlow.view.dispatch);
};
