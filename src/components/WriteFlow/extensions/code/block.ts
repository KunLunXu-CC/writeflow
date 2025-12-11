import { Node } from '@/components/WriteFlow/core/Node';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { CodeBlockNodeView } from './CodeBlockNodeView';

export const CodeBlock = Node.create({
  name: 'code_block',

  // options: {
  //   languageClassPrefix: 'language-',
  //   exitOnTripleEnter: true,
  //   exitOnArrowDown: true,
  //   defaultLanguage: null,
  //   HTMLAttributes: {},
  // },

  // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
  // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
  addSchema: (): NodeSpec => ({
    content: 'text*',

    marks: '',

    isolating: true,

    group: 'block',

    code: true,

    defining: true,

    toDOM() {
      return [
        'pre',
        {},
        [
          'code',
          {
            // class: node.attrs.language
            //   ? this.options.languageClassPrefix + node.attrs.language
            //   : null,
          },
          0,
        ],
      ];
    },
  }),

  // options: {
  //   HTMLAttributes: {},
  //   levels: [1, 2, 3, 4, 5, 6],
  // },

  // addCommands() {
  //   return {
  //     setHeading:
  //       (attributes) =>
  //       ({ commands }) => {
  //         if (!this.options.levels.includes(attributes.level)) {
  //           return false;
  //         }

  //         return commands.setNode(this.name, attributes);
  //       },
  //     toggleHeading:
  //       (attributes) =>
  //       ({ commands }) => {
  //         if (!this.options.levels.includes(attributes.level)) {
  //           return false;
  //         }

  //         return commands.toggleNode(this.name, 'paragraph', attributes);
  //       },
  //   };
  // },

  // addKeyboardShortcuts() {
  //   return this.options.levels.reduce(
  //     (items, level) => ({
  //       ...items,
  //       ...{
  //         [`Mod-Alt-${level}`]: () =>
  //           this.editor.commands.toggleHeading({ level }),
  //       },
  //     }),
  //     {},
  //   );
  // },

  addInputRules: ({ type }) => [
    textblockTypeInputRule(/^```(\w+)?\s$/, type as NodeType, (match) => ({
      language: match[1],
    })),
  ],

  addNodeView: () => (node, view, getPos) => new CodeBlockNodeView(node, view, getPos),
});
