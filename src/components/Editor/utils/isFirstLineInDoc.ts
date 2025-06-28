import { EditorState } from 'prosemirror-state';

/**
 * 判断光标是否在文档第一行(未测试)
 * @param state - 编辑器状态
 * @returns 是否在文档第一行
 */
const isFirstLineInDoc = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtStart = $from.parentOffset === 0;
  return isAtStart;
};

export default isFirstLineInDoc;
