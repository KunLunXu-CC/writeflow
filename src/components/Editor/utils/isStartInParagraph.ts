import { EditorState } from 'prosemirror-state';

/**
 * 判断光标是否在当前段落的第一个字符(未测试)
 * @param state - 编辑器状态
 * @returns 是否在当前段落的第一个字符
 */
const isStartInParagraph = (state: EditorState) => {
  const $from = state.selection.$from;
  const isAtStart = $from.parentOffset === 0;
  return isAtStart;
};

export default isStartInParagraph;
