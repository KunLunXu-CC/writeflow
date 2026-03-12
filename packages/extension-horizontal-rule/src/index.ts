import { NodeSpec } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';
import { InputRule } from 'prosemirror-inputrules';

import { insertHorizontalRule, InsertHorizontalRuleOptions } from './commands';
import './index.scss';

export const HorizontalRule = Node.create({
  name: 'horizontal_rule',

  addSchema: (): NodeSpec => ({
    atom: true, // 关键：把它当成原子节点
    group: 'block',
    selectable: true,
    // 决定了如果渲染节点, 比如: 渲染 Horizontal_rule 节点时, 会渲染成 <hr> 标签
    // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
    toDOM: () => [
      'p',
      {
        class: 'wf-horizontal-rule-wrapper',
      },
      ['hr'],
    ],

    parseDOM: [{ tag: 'hr' }],
  }),

  addCommands: ({ writeFlow, extension }) => ({
    insertHorizontalRule: (options: InsertHorizontalRuleOptions) =>
      insertHorizontalRule({ writeFlow, extension }, options),
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^---/, (state, match, start, end) => {
      writeFlow.commands.insertHorizontalRule({ end, start });
      return writeFlow.state.tr;
    }),
  ],
});
