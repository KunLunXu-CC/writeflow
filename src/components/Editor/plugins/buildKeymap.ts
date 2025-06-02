import { Command } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { splitListItem } from 'prosemirror-schema-list';
import { arrowHandlers } from '@/components/Editor/codeBlock';
import mySchema from '@/components/Editor/schema';

const customKeymap: { [key: string]: Command } = {
  Enter: splitListItem(mySchema.nodes.list_item), // 在列表中按回车键, 会创建一个新的列表项(默认是不会的)
};

const buildKeymap = () =>
  keymap({
    ...baseKeymap,
    ...customKeymap,
    ...arrowHandlers,
  });

export default buildKeymap;
