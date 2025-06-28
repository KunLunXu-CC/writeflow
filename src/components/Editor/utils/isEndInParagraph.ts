import { EditorState } from 'prosemirror-state';

interface IsEndInParagraphProps {
  state: EditorState;
}

/**
 * 判断光标是否在当前段落最后位置
 * @param state - 编辑器状态
 * @returns 是否在当前段落最后位置
 */
const isEndInParagraph = ({ state }: IsEndInParagraphProps) => {
  const $from = state.selection.$from;
  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
  return isAtEnd;
};

export default isEndInParagraph;
