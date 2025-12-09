import { NodeSpec } from 'prosemirror-model';
import { Node } from '@/components/WriteFlow/core/Node';
import { insertHardBreak } from './commands';

export const HardBreak = Node.create({
  name: 'hard_break',

  addSchema: () =>
    ({
      inline: true,
      group: 'inline',
      selectable: false,
      toDOM: () => ['br'],
      parseDOM: [{ tag: 'br' }],
    }) as NodeSpec,

  addCommands: ({ writeFlow, extension }) => {
    return {
      insertHardBreak: () => insertHardBreak({ writeFlow, extension }),
    };
  },

  addKeymap: ({ writeFlow }) => {
    return {
      // Shift + Enter: 在段落内插入换行符
      'Shift-Enter': () => writeFlow.commands.insertHardBreak(),
    };
  },
});
