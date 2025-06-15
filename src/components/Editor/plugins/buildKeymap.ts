import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { listKeymap } from '@/components/Editor/extension/list';
import { codeBlockKeymap } from '@/components/Editor/extension/codeBlock';

const customKeymap = [
  keymap(codeBlockKeymap),
  keymap(listKeymap()),
  keymap(baseKeymap),
];

export default customKeymap;
