import { keymap } from 'prosemirror-keymap';
import { getListKeymap } from '@/components/Editor/extension/list';
import { baseKeymap } from 'prosemirror-commands';
import { arrowHandlers } from '@/components/Editor/extension/codeBlock';

const customKeymap = [
  keymap(arrowHandlers),
  keymap(getListKeymap()),
  keymap(baseKeymap),
];

export default customKeymap;
