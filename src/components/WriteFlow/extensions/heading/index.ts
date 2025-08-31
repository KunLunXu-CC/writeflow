import { Node } from '@/components/WriteFlow/core/Node';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';

/**
 * The heading level options.
 */
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOptions {
  /**
   * The available heading levels.
   * @default [1, 2, 3, 4, 5, 6]
   * @example [1, 2, 3]
   */
  levels: Level[];

  /**
   * The HTML attributes for a heading node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, unknown>;
}

/**
 * This extension allows you to create headings.
 * @see https://www.tiptap.dev/api/nodes/heading
 */
export const Heading = Node.create<HeadingOptions>({
  name: 'heading',

  options: {
    HTMLAttributes: {},
    levels: [1, 2, 3, 4, 5, 6],
  },

  // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
  // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
  addSchema({ extension }) {
    const levels = extension?.options?.levels || [1, 2, 3, 4, 5, 6];

    return {
      content: 'inline*',
      group: 'block',
      defining: true,

      // 注意: toDOM 要想接收 attrs 属性, 需要先在这定义 attrs 属性, 才能正确传递获取到该属性值
      attrs: {
        level: { default: 1 },
      },

      // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
      // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
      toDOM: (node) => {
        const { level } = node.attrs;
        return [`h${level}`, {}, 0];
      },

      parseDOM: levels.map((level: Level) => ({
        tag: `h${level}`,
        attrs: { level },
      })),
    };
  },

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

  // 返回 InputRule 对象 { find, handler }[] 的数组
  addInputRules({ type, extension }) {
    const level: Level[] = extension.options?.levels || [];
    const first = level[0];
    const last = level[level.length - 1];

    return [
      textblockTypeInputRule(
        new RegExp(`^(#{${first},${last}})\\s$`),
        type as NodeType,
        (match) => ({
          level: match[1].length,
        }),
      ),
    ];
  },
});
