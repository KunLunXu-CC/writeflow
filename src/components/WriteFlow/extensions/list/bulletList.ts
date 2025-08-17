import { bulletList } from 'prosemirror-schema-list';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';

/**
 * 无序列表
 */
export const BulletList = Node.create({
  name: 'bulletList',

  addSchema() {
    return {
      ...bulletList,
      group: 'block',
      content: 'listItem+',
    };
  },
  addInputRules({ type }) {
    return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
  },
});
