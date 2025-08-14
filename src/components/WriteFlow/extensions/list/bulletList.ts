import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
// import { wrappingInputRule } from 'prosemirror-inputrules';
// import { InputRule } from '../../InputRules';
import { textblockTypeInputRule } from '../../InputRules/textblockTypeInputRule';
/**
 * This extension allows you to create headings.
 * @see https://www.tiptap.dev/api/nodes/heading
 */
export const Heading = Node.create({
  name: 'bullet_list',

  getSchema() {
    return {
      ...bulletList,
      group: 'block',
      content: 'list_item+',
    };
  },

  // 返回 InputRule 对象 { find, handler }[] 的数组
  addInputRules({ options, type }) {
    // 有序列表, 将一个以数字后跟一个点开头的文本块转换为有序列表。
    // wrappingInputRule(
    //   /^(\d+)\.\s$/,
    //   mySchema.nodes.ordered_list,
    //   (match) => ({ order: +match[1] }),
    //   (match, node) => node.childCount + node.attrs.order == +match[1],
    // ),
    // 无序列表, 将一个以破折号、加号或星号开头的文本块转换为无序列表。
    // wrappingInputRule(/^\s*([-+*])\s$/, mySchema.nodes.bullet_list),

    // return [
    //   new InputRule({
    //     find: /^\s*([-+*])\s$/,
    //     handler: ({ state, range }) => {

    //       wrappingInputRule
    //       // return state.tr.replaceSelectionWith(
    //       //   mySchema.nodes.bullet_list.createAndFill(),
    //       // );
    //     },
    //   }),
    // ];

    return options.levels.map((level: number) => {
      // 这里返回一个 InputRule 对象 { find, handler }, 而 InputRule 中的 handler 在 runInputRule 被执行
      return textblockTypeInputRule({
        type,
        attributes: { level },
        find: new RegExp(`^(#{${level},${level}})\\s$`),
      });
    });
  },
});
