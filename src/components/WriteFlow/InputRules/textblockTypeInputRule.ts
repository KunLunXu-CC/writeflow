import { NodeType } from 'prosemirror-model';
import { InputRuleFinder } from '../types';
import { InputRule } from '.';

/**
 * 构建一个输入规则，该规则在文本块的类型时更改文本块的类型
 * 将*匹配的文本输入其中。当使用正则表达式时，您将
 * 可能希望regexp以‘ ^ ’开头，以便模式可以
 * 只出现在文本块的开头
 * @see https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing#input-rules
 */
export function textblockTypeInputRule(config: {
  find: InputRuleFinder;
  type: NodeType;
  attributes?: Record<string, any>;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range }) => {
      const $start = state.doc.resolve(range.from);
      // const attributes =
      // callOrReturn(config.getAttributes, undefined, match) || {};
      // 通过 attributes 熟悉来进行参数的传递 => toDom
      const attributes = config.attributes || {};

      if (
        !$start
          .node(-1)
          .canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)
      ) {
        return null;
      }

      console.log(
        '%c [ attributes ]-35',
        'font-size:13px; background:#8530a4; color:#c974e8;',
        attributes,
      );

      return state.tr
        .delete(range.from, range.to)
        .setBlockType(range.from, range.from, config.type, attributes);
    },
  });
}
