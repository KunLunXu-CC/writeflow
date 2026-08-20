# @kunlunxu/wf-extension-base

WriteFlow 的基础行为扩展，提供撤销/重做、通用 wrapping 节点插入、文档变更事件和 gap cursor。

## 注册

```ts
import { Base } from '@kunlunxu/wf-extension-base';

const extensions = [Base];
```

多数结构扩展依赖 `insertWrapping`，实际项目通常都应注册 `Base`。

## Commands

| 命令                                         | 作用                                        | 返回值    |
| -------------------------------------------- | ------------------------------------------- | --------- |
| `writeFlow.commands.undo()`                  | 撤销最近一次历史操作                        | `boolean` |
| `writeFlow.commands.redo()`                  | 重做最近一次撤销                            | `boolean` |
| `writeFlow.commands.insertWrapping(options)` | 用指定 wrapping node 包裹当前选区或指定范围 | `boolean` |

`insertWrapping` 示例：

```ts
writeFlow.commands.insertWrapping({
  nodeType: writeFlow.schema.nodes.blockquote,
  start: writeFlow.state.selection.from,
  end: writeFlow.state.selection.to,
  attrs: {},
});
```

## Helpers

| Helper                             | 作用                                           |
| ---------------------------------- | ---------------------------------------------- |
| `writeFlow.helpers.isAtEndOfDoc()` | 判断当前选区终点是否位于文档最后一个可编辑位置 |

## 快捷键

| 平台            | 撤销     | 重做           |
| --------------- | -------- | -------------- |
| macOS           | `Cmd-z`  | `Cmd-Shift-z`  |
| Windows / Linux | `Ctrl-z` | `Ctrl-Shift-z` |

本包不处理 `Enter`、`Shift-Enter`、方向键或结构退出。

## 文档变更事件

文档发生实际变更后会触发 `WFEventKeys.docChange`：

```ts
import { WFEventKeys } from '@kunlunxu/wf-core';

const handleChange = ({ doc, value }) => {
  console.log(doc, value);
};

writeFlow.on(WFEventKeys.docChange, handleChange);
writeFlow.off(WFEventKeys.docChange, handleChange);
```

事件参数包含：

- `writeFlow`：当前编辑器实例。
- `doc`：最新 ProseMirror 文档节点。
- `value`：`doc.toJSON()` 的结果。

纯选区变化不会触发该事件。

## Gap Cursor

本包注册 `prosemirror-gapcursor`，允许在水平线、图片等不可直接放置文本光标的块节点之间创建 gap cursor。相关方向键和点击行为由 ProseMirror 插件处理，本包没有额外公开命令。
