import { redo, undo } from 'prosemirror-history';
import { Extendable } from '@/components/WriteFlow/core/Extendable';
import { gapCursor } from 'prosemirror-gapcursor';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Base = Extendable.create({
  name: 'base',

  addKeymap() {
    const isMac = globalThis.navigator?.userAgent.includes('Mac');
    const modKey = isMac ? 'Mod-' : 'Ctrl-';

    return {
      [`${modKey}z`]: undo, // 撤销
      [`${modKey}Shift-z`]: redo, // 重做
    };
  },

  addPlugins() {
    return [gapCursor()];
  },
});
