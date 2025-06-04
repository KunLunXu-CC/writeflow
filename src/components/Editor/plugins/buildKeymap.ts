import {
  sinkListItem,
  liftListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { arrowHandlers } from '@/components/Editor/extension/codeBlock';
import { baseKeymap, chainCommands } from 'prosemirror-commands';

import mySchema from '@/components/Editor/schema';

const customKeymap = keymap({
  ...baseKeymap,
  ...arrowHandlers,
  Enter: chainCommands(
    splitListItem(mySchema.nodes.list_item),
    splitListItem(mySchema.nodes.task_item),
    baseKeymap.Enter,
  ),

  Tab: sinkListItem(mySchema.nodes.list_item), // 列表: 按 tab 键, 会下沉列表项
  'Shift-Tab': liftListItem(mySchema.nodes.list_item), // 列表: 按 shift + tab 键, 会上移列表项
});

export default customKeymap;
