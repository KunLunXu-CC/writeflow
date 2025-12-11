import { NodeSpec } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';
import { insertHardBreak } from './commands';

export const HardBreak = Node.create({
  name: 'hard_break',

  addSchema: (): NodeSpec => ({
    inline: true,
    group: 'inline',
    selectable: false,
    toDOM: () => ['br'],
    parseDOM: [{ tag: 'br' }],
  }),

  addCommands: ({ writeFlow, extension }) => ({
    insertHardBreak: () => insertHardBreak({ writeFlow, extension }),
  }),

  addKeymap: ({ writeFlow }) => ({
    // Shift + Enter: 在段落内插入换行符
    'Shift-Enter': () => writeFlow.commands.insertHardBreak(),
  }),
});
