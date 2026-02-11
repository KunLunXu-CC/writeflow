import { Extendable } from '@/components/WriteFlow/core/Extendable';
import { gapCursor } from 'prosemirror-gapcursor';
import { redo, undo, insertWrapping } from './commands';
import { isAtEndOfDoc } from './helpers';
import { buildDocChangeListenerPlugin } from './buildChangeListenerPlugin';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Base = Extendable.create({
  name: 'base',

  addCommands: ({ writeFlow, extension }) => ({
    undo: undo.bind(null, { writeFlow, extension }), // 撤销
    redo: redo.bind(null, { writeFlow, extension }), // 重做
    insertWrapping: insertWrapping.bind(null, { writeFlow, extension }), // 插入 wrapping node
  }),

  addHelpers: ({ writeFlow, extension }) => ({
    isAtEndOfDoc: isAtEndOfDoc.bind(null, { writeFlow, extension }), // 判断是否在文档末尾
  }),

  addKeymap: ({ writeFlow }) => {
    const isMac = globalThis.navigator?.userAgent.includes('Mac');
    const modKey = isMac ? 'Mod' : 'Ctrl';
    return {
      [`${modKey}-z`]: () => writeFlow.commands.undo(), // 撤销
      [`${modKey}-Shift-z`]: () => writeFlow.commands.redo(), // 重做
    };
  },

  addPlugins: ({ writeFlow }) => [gapCursor(), buildDocChangeListenerPlugin({ writeFlow })],
});
