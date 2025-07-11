import {
  isEndInParagraph,
  isStartInParagraph,
} from '@/components/Editor/utils';
import { Mark } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { InputRule } from 'prosemirror-inputrules';
import mySchema from '@/components/Editor/schema';

const inputRegex = /(^|[^`])`([^`]+)`(?!`)/;

// 内联代码输入规则 - 将文本标记为 mask
export const inlineCodeInputRule = new InputRule(
  inputRegex,
  (state, match, start, end) => {
    const { tr } = state;
    const codeMark = mySchema.marks.code; // 使用 code mark 作为 mask

    if (codeMark) {
      tr.delete(start, start + 1); // 删除开始的反引号
      tr.delete(end - 1, end); // 删除结束的反引号
      tr.addMark(start, end - 1, codeMark.create()); // 为匹配的文本添加 mask mark（注意位置已经调整）
      tr.removeStoredMark(codeMark); // 移除 storedMark
    }

    return tr;
  },
);

const handleExitToRight: Command = (state, dispatch) => {
  const { tr } = state;
  const mark = mySchema.marks.code;
  const $from = state.selection.$from;
  const currentMarks = $from.marks();
  const isInMark = !!currentMarks.find(
    (m: Mark | null | undefined) => m?.type.name === mark.name,
  );

  if (isEndInParagraph(state) && isInMark) {
    tr.removeStoredMark(mark); // 移除 storedMark
    tr.insertText('\u00A0', $from.pos); // 插入空格
    dispatch?.(tr);

    return true;
  }

  return false;
};

const handleExitToLeft: Command = (state, dispatch) => {
  const { tr } = state;
  const mark = mySchema.marks.code;
  const $from = state.selection.$from;
  console.log(
    '%c [ $from ]-54',
    'font-size:13px; background:#783ea8; color:#bc82ec;',
    $from,
  );
  const currentMarks = $from.marks();
  const isInMark = !!currentMarks.find(
    (m: Mark | null | undefined) => m?.type.name === mark.name,
  );

  if (isStartInParagraph(state) && isInMark) {
    tr.removeStoredMark(mark); // 移除 storedMark
    tr.insertText('\u00A0', $from.pos); // 插入空格
    dispatch?.(tr);

    return true;
  }

  return false;
};

// 内联代码快捷键
export const inlineCodeKeymap: Record<string, Command> = {
  ArrowRight: handleExitToRight,
  ArrowLeft: handleExitToLeft,
};
