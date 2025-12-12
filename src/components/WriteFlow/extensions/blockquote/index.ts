import { NodeSpec, NodeType } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';
import { wrappingInputRule } from 'prosemirror-inputrules';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Blockquote = Node.create({
  name: 'blockquote',

  addSchema: (): NodeSpec => ({
    content: 'block+',

    group: 'block',

    defining: true,

    toDOM: () => {
      return ['blockquote', {}, 0];
    },
  }),

  addInputRules: ({ type }) => [wrappingInputRule(/^\s*>\s$/, type as NodeType)],
});
