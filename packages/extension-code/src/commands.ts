import { WFCommand } from '@kunlunxu/wf-core';
import { MarkType } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

/**
 * 切换当前文本选区的行内代码状态
 */
export const toggleInlineCode: WFCommand = ({ writeFlow, extension }) => {
  const { selection, tr, doc } = writeFlow.state;
  const codeMark = writeFlow.schema.marks[extension.name] as MarkType;

  if (
    !(selection instanceof TextSelection) ||
    selection.empty ||
    !selection.$from.sameParent(selection.$to) ||
    !codeMark
  ) {
    return false;
  }

  let hasText = false;
  let isFullyMarked = true;

  doc.nodesBetween(selection.from, selection.to, (node) => {
    if (!node.isText) {
      return;
    }

    hasText = true;
    isFullyMarked = isFullyMarked && Boolean(codeMark.isInSet(node.marks));
  });

  if (!hasText) {
    return false;
  }

  if (isFullyMarked) {
    tr.removeMark(selection.from, selection.to, codeMark);
  } else {
    tr.addMark(selection.from, selection.to, codeMark.create());
  }

  writeFlow.dispatch(tr);
  return true;
};
