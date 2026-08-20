# @kunlunxu/wf-extension-blockquote

提供 `blockquote` 块级节点、引用输入规则和引用插入命令。

## 注册

引用命令依赖 `Base` 提供的 `insertWrapping`：

```ts
import { Base } from '@kunlunxu/wf-extension-base';
import { Blockquote } from '@kunlunxu/wf-extension-blockquote';

const extensions = [Base, Blockquote];
```

## 输入规则

在空文本块开头输入下面的内容会创建引用：

```text
> 空格
```

前导空白也可以被识别。

## Commands

```ts
writeFlow.commands.insertBlockquote();

writeFlow.commands.insertBlockquote({
  start: writeFlow.state.selection.from,
  end: writeFlow.state.selection.to,
});
```

该命令用 `blockquote` 包裹当前范围。

## 快捷键、换行与退出

本包没有注册专属快捷键。

- 在有内容的引用段落中按 `Enter`，由 core 基础 keymap 拆分文本块，通常会继续创建引用内段落。
- 在空引用段落中按 `Enter`，core 会尝试提升空块，通常可退出当前引用。
- 注册 `HardBreak` 后，`Shift-Enter` 会在引用段落内部插入硬换行，不退出引用。

## 当前限制

- 没有取消引用或切换引用的公开命令。
- `insertBlockquote()` 当前没有透传 `insertWrapping()` 的布尔执行结果。
