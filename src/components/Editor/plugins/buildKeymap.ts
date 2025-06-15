import { Command } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { arrowHandlers } from '@/components/Editor/extension/codeBlock';
import { getListKeymap } from '@/components/Editor/extension/list';

const customKeymap = [
  keymap(arrowHandlers as Record<string, Command>),
  keymap(getListKeymap()),
  keymap(baseKeymap),
];

export default customKeymap;
