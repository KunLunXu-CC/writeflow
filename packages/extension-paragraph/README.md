# @kunlunxu/wf-extension-paragraph

提供带 `wf-paragraph` 样式类的段落节点，以及在当前块上方或下方插入段落的命令。

## 注册

```ts
import { Paragraph } from '@kunlunxu/wf-extension-paragraph';

const extensions = [Paragraph];
```

## Commands

| 命令                                        | 行为                                   |
| ------------------------------------------- | -------------------------------------- |
| `writeFlow.commands.insertParagraphBelow()` | 在当前最内层块节点之后插入空段落并聚焦 |
| `writeFlow.commands.insertParagraphAbove()` | 在当前最内层块节点之前插入空段落并聚焦 |

## 快捷键

`Mod` 在 macOS 上表示 `Cmd`，其他平台表示 `Ctrl`。

| 快捷键            | 行为                 |
| ----------------- | -------------------- |
| `Mod-Enter`       | 在当前块下方插入段落 |
| `Mod-Shift-Enter` | 在当前块上方插入段落 |

## 换行与退出

- 普通 `Enter` 不由本包处理，而是由 core 基础 keymap 拆分当前文本块。
- 注册 `HardBreak` 后，`Shift-Enter` 会插入段内硬换行。
- 在普通段落中，`Mod-Enter` 和 `Mod-Shift-Enter` 可快速在相邻位置创建新段落。

## 快捷键冲突与嵌套结构

- 本包的 `Mod-Enter` 与 core 的“退出代码块”键位相同。发生冲突时，最终行为取决于扩展 keymap 的装配顺序。
- 命令使用当前选区的最内层深度计算插入位置。在列表项、引用、表格单元格等嵌套结构中，它可能只在当前容器内部新增段落，不等同于退出整个结构。
