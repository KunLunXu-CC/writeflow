# @kunlunxu/wf-extension-list

提供无序列表、有序列表、任务列表，以及普通列表项和任务列表项的键盘行为。

## 注册

列表插入命令依赖 `Base` 的 `insertWrapping`。应按需要注册完整节点集合：

```ts
import { Base } from '@kunlunxu/wf-extension-base';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@kunlunxu/wf-extension-list';

const extensions = [Base, ListItem, TaskItem, BulletList, OrderedList, TaskList];
```

`BulletList` 和 `OrderedList` 依赖 `ListItem`；`TaskList` 依赖 `TaskItem`。

## 输入规则

在文本块开头输入以下内容并以空格结束：

| 输入             | 结果                   |
| ---------------- | ---------------------- |
| `- `             | 无序列表               |
| `+ `             | 无序列表               |
| `* `             | 无序列表               |
| `1. `、`2. ` 等  | 对应起始序号的有序列表 |
| `[ ] `           | 未完成任务列表         |
| `[x] ` 或 `[X] ` | 已完成任务列表         |

无序列表允许前导空白；有序列表和任务列表要求从文本块开头输入。

## Commands

| 命令                                             | 作用                                   |
| ------------------------------------------------ | -------------------------------------- |
| `writeFlow.commands.insertBulletList(options?)`  | 用无序列表包裹当前范围                 |
| `writeFlow.commands.insertOrderedList(options?)` | 用有序列表包裹当前范围，可传 `order`   |
| `writeFlow.commands.insertTaskList(options?)`    | 用任务列表包裹当前范围，可传 `checked` |

```ts
writeFlow.commands.insertOrderedList({ order: 3 });
writeFlow.commands.insertTaskList({ checked: false });
```

本包没有公开列表项拆分、缩进、反缩进或切换任务完成状态的 commands；这些结构操作目前只通过快捷键完成。

## 快捷键

普通列表项和任务列表项使用相同键位：

| 快捷键      | 行为                             |
| ----------- | -------------------------------- |
| `Enter`     | 拆分当前列表项并创建下一项       |
| `Tab`       | 将当前项下沉到前一个列表项之下   |
| `Shift-Tab` | 提升当前项；顶层项目会被移出列表 |

任务项按 `Enter` 创建的新任务默认是未完成状态。

## 换行和退出列表

- 在非空列表项中按 `Enter` 会创建新的列表项，不是段内换行。
- 在顶层空列表项中按 `Enter` 时，列表项快捷键会返回 `false`，随后 core 基础 keymap 会尝试提升空块，通常可以退出列表并创建普通段落。
- 在嵌套空列表项中按 `Enter` 会先拆分或提升嵌套结构。
- `Shift-Tab` 可以显式减少一级缩进；对顶层项使用时可退出列表。
- 注册 `HardBreak` 后，`Shift-Enter` 会在当前列表项段落内插入硬换行，不创建新列表项。
- 当前项没有前一个兄弟项时，`Tab` 无法下沉并会返回 `false`，后续可能触发浏览器默认焦点移动。

## 任务列表限制

- `checked` 会写入节点属性并渲染 checkbox。
- 当前没有 checkbox 点击事件或 `toggleTaskItem` 命令；直接点击原生 checkbox 产生的 DOM 状态不保证同步回 ProseMirror 文档。
- `parseDOM` 查找 `.task-list-item-checkbox`，但当前 `toDOM` 没有输出该 class，从 HTML 反解析 checked 状态时可能丢失。
