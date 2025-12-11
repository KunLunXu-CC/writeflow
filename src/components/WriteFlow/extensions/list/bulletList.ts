import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';

/**
 * 无序列表
 */
export const BulletList = Node.create({
  name: 'bullet_list',

  addSchema: (): NodeSpec => ({
    ...bulletList,
    group: 'block',
    content: 'list_item+',
  }),
  addInputRules: ({ type }) => [wrappingInputRule(/^\s*([-+*])\s$/, type as NodeType)],
});
