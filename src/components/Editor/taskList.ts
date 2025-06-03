import { NodeSpec } from 'prosemirror-model';
import { InputRule } from 'prosemirror-inputrules';
import mySchema from './schema';
import { EditorState, TextSelection } from 'prosemirror-state';

const todoItemSpec: NodeSpec = {
  attrs: {
    done: { default: false },
  },
  //content: "paragraph block*", // use this if you want to nest todos
  content: 'paragraph',
  defining: true,
  toDOM(node) {
    const { done } = node.attrs;

    return [
      'li',
      {
        'data-type': 'todo_item',
        'data-done': done.toString(),
      },
      // Custom span that can be styled using CSS as a checkbox
      [
        'span',
        {
          class: 'todo-checkbox',
          //contenteditable: 'false',
        },
      ],
      ['span', 0],
    ];
  },
  parseDOM: [
    {
      priority: 51, // Needs higher priority than other nodes that use a "li" tag
      tag: '[data-type="todo_item"]',
      getAttrs(dom) {
        return {
          done: dom.getAttribute('data-done') === 'true',
        };
      },
    },
  ],
};

const todoListSpec: NodeSpec = {
  group: 'block',
  content: 'todo_item+',
  toDOM() {
    return [
      'ul',
      {
        'data-type': 'todo_list',
      },
      0,
    ];
  },
  parseDOM: [
    {
      priority: 51, // Needs higher priority than other nodes that use a "ul" tag
      tag: '[data-type="todo_list"]',
    },
  ],
};

export const taskListNodes: Record<string, NodeSpec> = {
  todo_item: todoItemSpec,
  todo_list: todoListSpec,
};

// 表格输入规则, 将一个以 |- 开头的文本块转换为表格
export const taskListInputRule = new InputRule(/^\[([ |x])\]\s$/, function (
  state: EditorState,
  match,
  start,
  end,
) {
  const attrs = { checked: match[1] === 'x' };
  const tableNode = mySchema.nodes.todo_item.create(attrs)!;
  const tr = state.tr.delete(start - 1, end).replaceSelectionWith(tableNode);
  return tr.setSelection(TextSelection.create(tr.doc, start));

  // const $from = state.selection.$from;
  // // const listItemPos = $from.before(-1);
  // const attrs = { checked: match[1] === 'x' };
  // return state.tr
  //   .delete(start, end)
  //   .insert(start, mySchema.nodes.todo_item.create(attrs));
  // if (
  //   $from.depth >= 3 &&
  //   $from.node(-1).type.name === 'todo_item' &&
  //   $from.node(-2).type.name === 'todo_list' &&
  //   $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
  // ) {
  //   const attrs = { checked: match[1] === 'x' };
  //   const listItemPos = $from.before(-1);
  //   return state.tr
  //     .delete(start, end)
  //     .insert(listItemPos + 1, mySchema.nodes.todo_item.create(attrs));
  // }
  // return null;
});

// export const taskListInputRule = new InputRule(
//   /^\[([ |x])\]\s$/,
//   (state, match, start, end) => {
//     // const cellNodes = Array.from(
//     //   { length: COL_COUNT_INPUT_RULE },
//     //   () => mySchema.nodes.table_cell.createAndFill()!,
//     // );

//     // const rowNodes = Array.from(
//     //   { length: ROW_COUNT_INPUT_RULE },
//     //   () => mySchema.nodes.table_row.createAndFill(null, cellNodes)!,
//     // );

//     // const tableNode = mySchema.nodes.table.createAndFill(null, rowNodes)!;
//     // const tr = state.tr.delete(start, end).replaceSelectionWith(tableNode);
//     // return tr.setSelection(TextSelection.create(tr.doc, start));
//     // const $from = state.selection.$from;

//     // const listItemPos = $from.before(-1);

//     // return wrapInList(mySchema.nodes.todo_list);

//     // const listItemPos = state.selection.$from.before(-1);
//     const type = mySchema.nodes.todo_list;
//     const attrs = { checked: match[1] === 'x' };
//     // console.log(listItemPos, type, attrs);

//     return state.tr.delete(start, end).insert(start + 1, type.create(attrs));
//   },
// );

/**
new InputRule(/^\[([ |x])\] $/, function (state: EditorState, match, start, end) {
  const $from = state.selection.$from
  if (
      $from.depth >= 3 &&
      $from.node(-1).type.name === "rinoListItem" &&
      $from.node(-2).type.name === "rinoBulletList" &&
      $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
  ) {
      const attrs = { checked: match[1] === "x" }
      const listItemPos = $from.before(-1)
      return state.tr.delete(start, end).insert(listItemPos + 1, type.create(attrs))
  }
  return null
})
  
function handleClickOn(editorView, pos, node, nodePos, event) {
  if (event.target.className === 'todo-checkbox') {
    editorView.dispatch(toggleTodoItemAction(editorView.state, nodePos, node))
    return true
  }
}

function toggleTodoItemAction(state, pos, todoItemNode) {
  return state.tr.setNodeMarkup(pos, null, {done: !todoItemNode.attrs.done})
}

const todoItemKeymap = {
  'Enter': splitListItem(mySchema.nodes.todo_item),
  // 'Tab': sinkListItem(mySchema.nodes.todo_item), // use this if you want to nest todos
  'Shift-Tab': liftListItem(mySchema.nodes.todo_item)
}

// ==================================================================================================================================================
// NOTE: this code was copied from https://github.com/ProseMirror/prosemirror-example-setup/blob/cd2a731d68dec3e9ef376459a135afe61f968d7c/src/menu.js
// // ==================================================================================================================================================
// function cmdItem(cmd, options) {
//   let passedOptions = {
//     label: options.title,
//     run: cmd
//   }
//   for (let prop in options) passedOptions[prop] = options[prop]
//   if ((!options.enable || options.enable === true) && !options.select)
//     passedOptions[options.enable ? "enable" : "select"] = state => cmd(state)

//   return new MenuItem(passedOptions)
// }

// function wrapListItem(nodeType, options) {
//   return cmdItem(wrapInList(nodeType, options.attrs), options)
// }

// const wrapTodoList = wrapListItem(mySchema.nodes.todo_list, {
//   title: "Wrap in todo list",
//   icon: icons.bulletList,
//   attrs: {
//     "data-type": "todo_list"
//   }
// })

// ==================================================================================================================================================
// end of copied code
// ==================================================================================================================================================

const menu = buildMenuItems(mySchema)
menu.blockMenu[0].push(wrapTodoList)

const plugins = [keymap(todoItemKeymap)].concat(exampleSetup({schema: mySchema, menuContent: menu.fullMenu}))

window.view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
    plugins
  }),
  handleClickOn
})
 */
