import { WFCommand } from '../../types';

/**
 * 插入硬换行命令
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertHardBreak: WFCommand = (writeFlow) => {
  if (!writeFlow.view) {
    return false;
  }

  const { state, dispatch } = writeFlow.view;
  const { hard_break: hardBreakType } = state.schema.nodes;

  const newTr = state.tr
    .replaceSelectionWith(hardBreakType.create())
    .scrollIntoView();

  dispatch(newTr);

  return true;
};
