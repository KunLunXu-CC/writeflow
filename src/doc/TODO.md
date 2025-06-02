
## TODO

- 列表 TAB 快捷键实现, https://codesandbox.io/p/sandbox/wizardly-nova-t9mzsm
- checkbox

https：//github.com/ocavue/rino/blob/5136c00f17365ebd8d8f43c45a627780401b1476/packages/web/src/editor/extensions/list/list-extension.ts#L199
https://github.com/ProseMirror/prosemirror-markdown/issues/42
```js
public inputRules({ type }: ExtensionManagerNodeTypeParams) {
    return [
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
        }),
    ]
}
```

- 行内代码块
