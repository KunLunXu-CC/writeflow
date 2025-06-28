import { EditorState } from 'prosemirror-state';

/**
 * 判断光标是否在文档最后一行(未测试)
 * @param state - 编辑器状态
 * @returns 是否在文档最后一行
 */
const isLastLineInDoc = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
  return isAtEnd;
};

export default isLastLineInDoc;
