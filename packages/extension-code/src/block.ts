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

    // 定义节点属性
    attrs: {
      language: {
        default: null,
        validate: 'string|null',
      },
    },

    toDOM: (node) => {
      const { language } = node.attrs;
      return ['pre', {}, ['code', { language }, 0]];
    },

    parseDOM: [
      {
        tag: 'pre > code', // 只匹配 pre 内的 code 标签, 即代码块
        getAttrs(dom) {
          // 从 class 属性中提取语言信息, class 可能包含类似 "language-js" 的值
          const classAttr = dom?.getAttribute('class') || '';
          const { language } = classAttr.match(/language-(?<language>\w+)/)?.groups ?? {};
          return { language };
        },
      },
    ],
  }),

  addInputRules: ({ type }) => [
    textblockTypeInputRule(/^```(\w+)?\s$/, type as NodeType, (match) => ({
      language: match[1],
    })),
  ],

  addNodeView: () => (node, view, getPos) => new CodeBlockNodeView(node, view, getPos),
});
