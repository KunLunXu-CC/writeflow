import { WriteFlow, WFCommand } from '../../types';

/**
 * 插入硬换行命令
 * @param {object} state - 编辑器状态
 * @param {function} dispatch - 调度函数
 * @return {function} 命令函数
 */

export const insertHardBreak: WFCommand = (writeFlow) => {
  const { state, view } = writeFlow;
  const { hard_break: hardBreakType } = state.schema.nodes;
  const dispatch = view?.dispatch;

  if (!dispatch) {
    return false;
  }

  const newTr = state.tr
    .replaceSelectionWith(hardBreakType.create())
    .scrollIntoView();

  dispatch(newTr);

  return true;
};
