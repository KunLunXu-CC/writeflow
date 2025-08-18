import { Mark } from '@/components/WriteFlow/core/Mark';
import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';
import {
  isEndInParagraph,
  isStartInParagraph,
} from '@/components/WriteFlow/helpers/selection';
import { Command, TextSelection } from 'prosemirror-state';

const inputRegex = /(^|[^`])`([^`]+)`(?!`)/;

const maybeEscape =
  (dir: 'left' | 'right', mark: MarkType): Command =>
  (state, dispatch) => {
    const $from = state.selection.$from;
    const currentMarks = $from.marks();

    const isInMark = !!currentMarks.find((m) => m?.type.name === mark.name);

    if (!isInMark || !isEndInParagraph(state) || !isStartInParagraph(state)) {
      return false;
    }

    const { tr } = state;
    tr.removeStoredMark(mark); // 移除 storedMark
    tr.insertText('\u00A0', $from.pos); // 插入空格

    if (dir === 'left') {
      tr.setSelection(TextSelection.create(tr.doc, $from.pos));
    }

    dispatch?.(tr);
    return true;
  };

export const InlineCode = Mark.create({
  name: 'inlineCode',

  addSchema() {
    return {
      excludes: '_',

      code: true,

      exitable: true,

      toDOM() {
        return ['code', {}, 0];
      },
    };
  },

  addInputRules({ type }) {
    return [
      new InputRule(inputRegex, (state, match, start, end) => {
        const { tr } = state;
        const codeMark = type as MarkType; // 使用 code mark 作为 mask

        if (codeMark) {
          tr.delete(start, start + 1); // 删除开始的反引号
          tr.delete(end - 1, end); // 删除结束的反引号
          tr.addMark(start, end - 1, codeMark.create()); // 为匹配的文本添加 mask mark（注意位置已经调整）
          tr.removeStoredMark(codeMark); // 移除 storedMark
        }

        return tr;
      }),
    ];
  },

  addKeymap({ type }) {
    return {
      ArrowRight: maybeEscape('left', type as MarkType),
      ArrowLeft: maybeEscape('right', type as MarkType),
    };
  },
});
