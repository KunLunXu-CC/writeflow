import {
  lift,
  wrapIn,
  joinUp,
  exitCode,
  joinDown,
  toggleMark,
  baseKeymap,
  setBlockType,
  chainCommands,
  selectParentNode,
} from 'prosemirror-commands';
import { Command } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { arrowHandlers } from '@/components/Editor/codeBlock';
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from 'prosemirror-schema-list';
import mySchema from '@/components/Editor/schema';

// const mac =
//   typeof navigator != 'undefined'
//     ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
//     : false;

const createNewLine = chainCommands(exitCode, (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr
        .replaceSelectionWith(mySchema.nodes.paragraph.create())
        .scrollIntoView(),
    );
  }
  return true;
});

const customKeymap: { [key: string]: Command } = {
  'Mod-z': undo,
  'Shift-Mod-z': redo,

  Backspace: undoInputRule,

  'Alt-ArrowUp': joinUp,
  'Alt-ArrowDown': joinDown,
  'Mod-BracketLeft': lift,
  Escape: selectParentNode,

  'Mod-b': toggleMark(mySchema.marks.strong),
  'Mod-B': toggleMark(mySchema.marks.strong),
  'Mod-i': toggleMark(mySchema.marks.em),
  'Mod-I': toggleMark(mySchema.marks.em),
  'Mod-`': toggleMark(mySchema.marks.code),

  'Shift-Ctrl-8': wrapInList(mySchema.nodes.bullet_list),
  'Shift-Ctrl-9': wrapInList(mySchema.nodes.ordered_list),
  'Ctrl->': wrapIn(mySchema.nodes.blockquote),

  'Shift-Ctrl-0': setBlockType(mySchema.nodes.paragraph),
  'Shift-Ctrl-\\': setBlockType(mySchema.nodes.code_block),

  'Mod-Enter': createNewLine,
  'Shift-Enter': createNewLine,

  Enter: splitListItem(mySchema.nodes.list_item),
  'Mod-[': liftListItem(mySchema.nodes.list_item),
  'Mod-]': sinkListItem(mySchema.nodes.list_item),

  'Shift-Ctrl-1': setBlockType(mySchema.nodes.heading, { level: 1 }),
  'Shift-Ctrl-2': setBlockType(mySchema.nodes.heading, { level: 2 }),
  'Shift-Ctrl-3': setBlockType(mySchema.nodes.heading, { level: 3 }),
  'Shift-Ctrl-4': setBlockType(mySchema.nodes.heading, { level: 4 }),
  'Shift-Ctrl-5': setBlockType(mySchema.nodes.heading, { level: 5 }),
  'Shift-Ctrl-6': setBlockType(mySchema.nodes.heading, { level: 6 }),

  'Mod-_': setBlockType(mySchema.nodes.horizontal_rule),
  'Shift-Ctrl-_': setBlockType(mySchema.nodes.horizontal_rule),
};

//  = (schema: Schema) => {
//   const keys

// const macKeys: { [key: string]: Command } = {
//   'Mod-y': redo,
//   'Ctrl-Enter': createNewLine,
// };

// let type;

// if ((type = schema.nodes.horizontal_rule)) {
//   const hr = type;
//   bind('Mod-_', (state, dispatch) => {
//     if (dispatch)
//       dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
//     return true;
//   });
// }
// };

const buildKeymap = () => {
  // 这边 baseKeymap 的优先级更高，所以需要把 baseKeymap 放在后面,
  return [keymap(customKeymap), keymap(baseKeymap), keymap(arrowHandlers)];
};

export default buildKeymap;
