import { InputRule } from 'prosemirror-inputrules';
import mySchema from '@/components/Editor/schema';

// 内联代码输入规则
export const inlineCodeInputRule = new InputRule(
  /`([^`]+)`$/,
  (state, match, start, end) => {
    const { tr } = state;
    const codeMark = mySchema.marks.code;

    if (codeMark) {
      // 删除开始的反引号
      tr.delete(start, start + 1);
      // 删除结束的反引号
      tr.delete(end - 1, end);
      // 为匹配的文本添加 code mark（注意位置已经调整）
      tr.addMark(
        start,
        end - 2,
        codeMark.create({
          language: 'javascript',
        }),
      );
    }

    return tr;
  },
);
