import { InputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';

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

  addCommands: ({ writeFlow, type }) => ({
    insertBlockquote: (opts: { end?: number; start?: number } = {}) => {
      const { end, start } = opts;
      writeFlow.commands.insertWrapping({
        end,
        start,
        nodeType: type as NodeType,
      });
    },
  }),

  addInputRules: ({ writeFlow }) => [
    new InputRule(/^\s*>\s$/, (state, match, start, end) => {
      writeFlow.commands.insertBlockquote({ end, start });
      return writeFlow.state.tr;
    }),
  ],
});
