import { keymap } from 'prosemirror-keymap';
import { Command } from 'prosemirror-state';
import { redo, undo } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { listKeymap } from '@/components/Editor/extension/list';
import { codeBlockKeymap } from '@/components/Editor/extension/codeBlock';

const isMac = window.navigator.userAgent.includes('Mac');
const modKey = isMac ? 'Mod-' : 'Ctrl-';

const customKeymap: Record<string, Command> = {
  // 撤销
  [`${modKey}z`]: (state, dispatch) => {
    undo(state, dispatch);
    return true;
  },
  // 重做
  [`${modKey}Shift-z`]: (state, dispatch) => {
    redo(state, dispatch);
    return true;
  },
};

const myKeymap = [
  keymap(codeBlockKeymap),
  keymap(listKeymap()),
  keymap(baseKeymap),
  keymap(customKeymap),
];

export default myKeymap;
