# @kunlunxu/wf-extension-code

提供行内代码 `InlineCode` 和基于 CodeMirror 6 的代码块 `CodeBlock`。

## 注册

```ts
import { CodeBlock, InlineCode } from '@kunlunxu/wf-extension-code';

const extensions = [CodeBlock, InlineCode];
```

代码块使用自定义 NodeView，内部编辑由 CodeMirror 完成，再同步到外层 ProseMirror 文档。

## 行内代码

### 输入规则

输入成对反引号会转换为行内代码：

```text
`inline code`
```

空内容不会触发转换。转换完成后反引号会被移除，正文添加 `inline_code` mark。

### 继续输入和退出

`inline_code` 使用 `inclusive: false`，因此光标位于行内代码末尾时，后续输入不会继续继承该 mark。输入结束反引号后可以直接继续输入普通文本，不需要额外按方向键。

本包没有提供手动设置、切换或取消行内代码的公开命令和快捷键。

## 代码块

### 输入规则

在文本块开头输入三个反引号、可选语言名和空格，会转换为代码块：

````text
```js
````

语言名只接受 `\w+`。不填语言时直接在三个反引号后输入空格。

### 语法高亮

当前内置以下语言匹配：

- CSS
- HTML
- JSON
- Diff
- Shell、sh、bash
- JavaScript、js、TypeScript、ts
- JSX、TSX

其他语言仍可保存到 `language` 属性，但只使用默认高亮样式。

## 代码块专属快捷键

以下键位由 `CodeBlockNodeView` 注册，优先于 CodeMirror 默认键位：

| 快捷键                               | 条件                   | 行为                                       |
| ------------------------------------ | ---------------------- | ------------------------------------------ |
| `ArrowLeft`                          | 光标位于整个代码块开头 | 退出到代码块之前；前面没有块时自动创建段落 |
| `ArrowRight`                         | 光标位于整个代码块末尾 | 退出到代码块之后；后面没有块时自动创建段落 |
| `ArrowUp`                            | 光标位于第一行         | 退出到代码块之前；前面没有块时自动创建段落 |
| `ArrowDown`                          | 光标位于最后一行       | 退出到代码块之后；后面没有块时自动创建段落 |
| `Backspace`                          | 代码块为空             | 删除整个代码块                             |
| `Backspace`                          | 代码块非空             | 交给 CodeMirror，删除前一个字符            |
| `Ctrl-Backspace`                     | 任意位置               | 强制删除整个代码块，包括全部内容           |
| `Ctrl-Enter`                         | 任意位置               | 退出代码块，并聚焦到后续块                 |
| `Ctrl-z` / macOS `Cmd-z`             | 任意位置               | 撤销外层 ProseMirror 历史                  |
| `Ctrl-Shift-z` / macOS `Cmd-Shift-z` | 任意位置               | 重做外层 ProseMirror 历史                  |

方向键退出只在选区为空时生效。存在文本选区时会继续使用 CodeMirror 的选择移动行为。

## CodeMirror 默认快捷键

代码块还注册了 `@codemirror/commands` 的 `defaultKeymap`。下表中的 `Mod` 在 macOS 上是 `Cmd`，其他平台是 `Ctrl`。

### 基础编辑与导航

| 快捷键                                              | 行为                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| `Enter` / `Shift-Enter`                             | 插入换行并自动缩进                                                    |
| `ArrowLeft/Right/Up/Down`                           | 移动光标；加 `Shift` 时扩展选区；到代码块边界时优先执行上面的退出规则 |
| `Ctrl-ArrowLeft/Right`；macOS `Alt-ArrowLeft/Right` | 按词组移动；加 `Shift` 时扩展选区                                     |
| macOS `Cmd-ArrowLeft/Right`                         | 移动到行首/行尾；加 `Shift` 时扩展选区                                |
| `PageUp` / `PageDown`                               | 上下翻页；加 `Shift` 时扩展选区                                       |
| `Home` / `End`                                      | 移动到可视行边界；加 `Shift` 时扩展选区                               |
| `Mod-Home` / `Mod-End`                              | 移动到文档开头/末尾；加 `Shift` 时扩展选区                            |
| `Mod-a`                                             | 全选代码块内容                                                        |
| `Backspace` / `Delete`                              | 向前/向后删除字符；空代码块的 `Backspace` 例外                        |
| Windows/Linux `Ctrl-Backspace` / `Ctrl-Delete`      | 按词组删除；其中 `Ctrl-Backspace` 被强制删除代码块覆盖                |
| macOS `Alt-Backspace` / `Alt-Delete`                | 按词组删除                                                            |
| macOS `Cmd-Backspace` / `Cmd-Delete`                | 删除到行首/行尾                                                       |

### 代码编辑

| 快捷键                                              | 行为                                                                                         |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Alt-ArrowLeft/Right`；macOS `Ctrl-ArrowLeft/Right` | 按语法单元移动；加 `Shift` 时扩展选区                                                        |
| `Alt-ArrowUp/Down`                                  | 上移/下移当前行                                                                              |
| `Shift-Alt-ArrowUp/Down`                            | 向上/向下复制当前行                                                                          |
| `Mod-Alt-ArrowUp/Down`                              | 在上方/下方添加光标                                                                          |
| `Escape`                                            | 简化多重选区                                                                                 |
| `Mod-Enter`                                         | 插入下方空行；Windows/Linux 的 `Ctrl-Enter` 会先被“退出代码块”覆盖，macOS 可使用 `Cmd-Enter` |
| Windows/Linux `Alt-l`；macOS `Ctrl-l`               | 选择当前行                                                                                   |
| `Mod-i`                                             | 选择父级语法节点                                                                             |
| `Mod-[` / `Mod-]`                                   | 减少/增加缩进                                                                                |
| `Mod-Alt-\`                                         | 自动缩进选区                                                                                 |
| `Shift-Mod-k`                                       | 删除当前行                                                                                   |
| `Shift-Mod-\`                                       | 跳转到匹配括号                                                                               |
| `Mod-/`                                             | 切换行注释；需要当前语言提供注释规则                                                         |
| `Shift-Alt-a`                                       | 切换块注释；需要当前语言提供注释规则                                                         |
| Windows/Linux `Ctrl-m`；macOS `Shift-Alt-m`         | 切换 Tab 焦点模式                                                                            |

macOS 还继承 CodeMirror 的 Emacs 风格键位：

| 快捷键              | 行为                                   |
| ------------------- | -------------------------------------- |
| `Ctrl-b` / `Ctrl-f` | 左移/右移光标；加 `Shift` 时扩展选区   |
| `Ctrl-p` / `Ctrl-n` | 上移/下移光标；加 `Shift` 时扩展选区   |
| `Ctrl-a` / `Ctrl-e` | 移动到行首/行尾；加 `Shift` 时扩展选区 |
| `Ctrl-d` / `Ctrl-h` | 向后/向前删除字符                      |
| `Ctrl-k`            | 删除到行尾                             |
| `Ctrl-Alt-h`        | 向前删除词组                           |
| `Ctrl-o`            | 在光标处拆行，并把光标留在上一行       |
| `Ctrl-t`            | 交换光标两侧字符                       |
| `Ctrl-v`            | 向下翻页                               |

## Tab 行为

本包没有注册 CodeMirror 的 `indentWithTab`，因此不要依赖 `Tab` / `Shift-Tab` 调整缩进。是否转移浏览器焦点由 CodeMirror 的 Tab 焦点模式和浏览器默认行为决定。

## 当前限制

- 没有公开的代码块插入、删除或语言切换命令，代码块主要通过输入规则和 Markdown 导入产生。
- `Ctrl-Backspace` 是破坏性操作，会直接删除整个非空代码块，并覆盖 CodeMirror 在 Windows/Linux 上默认的按词删除。
- `Ctrl-Enter` 只绑定了 Control 键；macOS 上不是 `Cmd-Enter`。
