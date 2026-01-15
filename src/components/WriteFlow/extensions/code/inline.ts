import { Mark } from '@/components/WriteFlow/core/Mark';
import { InputRule } from 'prosemirror-inputrules';
import { MarkType, NodeSpec } from 'prosemirror-model';

const inputRegex = /`([^`]+)`$/;

export const InlineCode = Mark.create({
  name: 'inline_code',

  addSchema: (): NodeSpec => ({
    excludes: '_',

    code: true,

    exitable: true,

    toDOM() {
      return ['code', {}, 0];
    },
  }),

  addInputRules: ({ type }) => [
    new InputRule(inputRegex, (state, match, start, end) => {
      const { tr } = state;
      const codeMark = type as MarkType; // 使用 code mark

      if (codeMark) {
        tr.delete(start, start + 1); // 删除开始的反引号
        tr.delete(tr.mapping.map(end, -1), tr.mapping.map(end)); // 删除结束的反引号 + 空格
        tr.addMark(start, tr.mapping.map(end), codeMark.create()); // 为匹配的文本添加 mark (注意位置已经调整)
        tr.removeStoredMark(codeMark); // 移除 storedMark
      }

      return tr;
    }),
  ],
});
