import { TextSelection } from 'prosemirror-state';
import { WFCommand } from '../../types';
import { isNumber } from 'lodash-es';

export interface InsertTaskItemOptions {
  end?: number;
  start?: number;
  attrs?: Record<string, any>;
}

/** 插入 task list */
export const insertTaskList: WFCommand<InsertTaskItemOptions> = ({ writeFlow }, options) => {
  const { start, end, attrs } = options ?? {};
  const { state, schema, dispatch } = writeFlow;
  const { tr, selection } = state;

  if (isNumber(start) && isNumber(end)) {
    tr.delete(start, end);
  }

  // 1. 创建 task list 节点
  const taskItem = schema.nodes.task_item.createAndFill(attrs);
  const taskList = schema.nodes.task_list.createAndFill(null, taskItem)!;

  // 2. 用 task list 节点替换当前选区
  tr.replaceSelectionWith(taskList);

  // 3. 设置选区
  const endPos = tr.mapping.map(selection.from); // 使用映射后的位置
  const $end = tr.doc.resolve(endPos);
  tr.setSelection(TextSelection.near($end, -1)); // 使用 TextSelection.near() 自动找到最佳的位置, -1 表示向后查找

  // 4. 更新状态
  dispatch(tr);

  return true;
};
