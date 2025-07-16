import { keymap } from 'prosemirror-keymap';
import { Command } from 'prosemirror-state';
import { redo, undo } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { listKeymap } from '@/components/WriteFlow/extension/list';
import { codeBlockKeymap } from '@/components/WriteFlow/extension/codeBlock';
import { inlineCodeKeymap } from '@/components/WriteFlow/extension/inlineCode';

const isMac = globalThis.navigator?.userAgent.includes('Mac');
const modKey = isMac ? 'Mod-' : 'Ctrl-';

const customKeymap: Record<string, Command> = {
  // 撤销
  [`${modKey}z`]: undo,
  // 重做
  [`${modKey}Shift-z`]: redo,
};

const myKeymap = [
  keymap(codeBlockKeymap),
  keymap(inlineCodeKeymap),
  keymap(listKeymap()),
  keymap(baseKeymap),
  keymap(customKeymap),
];

export default myKeymap;
