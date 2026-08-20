# @kunlunxu/wf-extension-hard-break

提供段落内部的硬换行节点 `hard_break`。

## 注册

```ts
import { HardBreak } from '@kunlunxu/wf-extension-hard-break';

const extensions = [HardBreak];
```

## Commands

```ts
writeFlow.commands.insertHardBreak();
```

命令会用 `<br>` 替换当前选区，并把光标留在硬换行之后。

## 快捷键

| 快捷键        | 行为                       |
| ------------- | -------------------------- |
| `Shift-Enter` | 在当前文本块内部插入硬换行 |

## `Enter` 与 `Shift-Enter` 的区别

- `Enter` 由 core 基础 keymap 处理，通常拆分为两个段落或结构块。
- `Shift-Enter` 插入 `<br>`，继续停留在当前段落、标题、引用或表格单元格中。

本包没有退出列表、引用、代码块或表格的逻辑。
