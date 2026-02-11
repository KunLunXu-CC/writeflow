// import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';

/**
 * 无序列表
 */
export const BulletList = Node.create({
  name: 'bullet_list',

  addSchema: (): NodeSpec => ({
    group: 'block',
    content: 'list_item+',
    toDOM: () => [
      'ul',
      {
        class: 'wf-bullet-list',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'ul',
      },
    ],
  }),
  addInputRules: ({ type }) => [wrappingInputRule(/^\s*([-+*])\s$/, type as NodeType)],
});
