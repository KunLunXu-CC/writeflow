import { EditorState } from 'prosemirror-state';

/**
 * 判断光标是否在当前段落的第一个字符(未测试)
 * @param state - 编辑器状态
 * @returns 是否在当前段落的第一个字符
 */
export const isStartInParagraph = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtStart = $from.parentOffset === 0;
  return isAtStart;
};

/**
 * 判断光标是否在文档最后一行(未测试)
 * @param state - 编辑器状态
 * @returns 是否在文档最后一行
 */
export const isLastLineInDoc = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
  return isAtEnd;
};

/**
 * 判断光标是否在文档第一行(未测试)
 * @param state - 编辑器状态
 * @returns 是否在文档第一行
 */
export const isFirstLineInDoc = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtStart = $from.parentOffset === 0;
  return isAtStart;
};

/**
 * 判断光标是否在当前段落最后位置
 * @param state - 编辑器状态
 * @returns 是否在当前段落最后位置
 */
export const isEndInParagraph = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
  return isAtEnd;
};
