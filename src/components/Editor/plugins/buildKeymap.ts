import { keymap } from 'prosemirror-keymap';
import { getListKeymap } from '@/components/Editor/extension/list';
import { baseKeymap } from 'prosemirror-commands';

const customKeymap = [keymap(getListKeymap()), keymap(baseKeymap)];

export default customKeymap;
