import type { ResolvedPos } from 'prosemirror-model';

/**
 * 返回一个解析的 PM 位置的文本内容
 * @param $from 要获取文本内容的解析位置
 * @param maxMatch 最大匹配字符数
 * @returns 文本内容
 */
export const getTextContentFromNodes = ($from: ResolvedPos, maxMatch = 500) => {
  let textBefore = '';

  const sliceEndPos = $from.parentOffset;

  $from.parent.nodesBetween(
    Math.max(0, sliceEndPos - maxMatch),
    sliceEndPos,
    (node, pos, parent, index) => {
      const chunk =
        node.type.spec.toText?.({
          node,
          pos,
          parent,
          index,
        }) ||
        node.textContent ||
        '%leaf%';

      textBefore +=
        node.isAtom && !node.isText
          ? chunk
          : chunk.slice(0, Math.max(0, sliceEndPos - pos));
    },
  );

  return textBefore;
};
