import { Extendable } from '@/components/WriteFlow/core/Extendable';
import { gapCursor } from 'prosemirror-gapcursor';
import { redo, undo } from './commands';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Base = Extendable.create({
  name: 'base',

  addCommands: ({ writeFlow, extension }) => ({
    undo: () => undo({ writeFlow, extension }), // 撤销
    redo: () => redo({ writeFlow, extension }), // 重做
  }),

  addKeymap: ({ writeFlow }) => {
    const isMac = globalThis.navigator?.userAgent.includes('Mac');
    const modKey = isMac ? 'Mod' : 'Ctrl';
    return {
      [`${modKey}-z`]: () => writeFlow.commands.undo(), // 撤销
      [`${modKey}-Shift-z`]: () => writeFlow.commands.redo(), // 重做
    };
  },

  addPlugins: () => [gapCursor()],
});
