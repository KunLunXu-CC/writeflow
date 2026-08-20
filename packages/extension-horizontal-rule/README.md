# @kunlunxu/wf-extension-horizontal-rule

提供可选中的块级水平分割线节点。

## 注册

```ts
import { HorizontalRule } from '@kunlunxu/wf-extension-horizontal-rule';

const extensions = [HorizontalRule];
```

## 输入规则

在文本块开头连续输入三个连字符会插入分割线：

```text
---
```

转换完成后，命令会把光标移动到分割线后的可编辑位置；如果后面没有段落，会自动创建一个空段落。

## Commands

```ts
writeFlow.commands.insertHorizontalRule();

writeFlow.commands.insertHorizontalRule({
  start: writeFlow.state.selection.from,
  end: writeFlow.state.selection.to,
});
```

传入 `start` 和 `end` 时会先删除该范围，再插入分割线。

## 快捷键与退出

本包不注册专属快捷键。

- 分割线是 `atom` 且可选中。
- 点击选中后，可通过 core 的 `Backspace` 或 `Delete` 删除选中的分割线。
- 输入规则和命令会主动保证分割线后存在可编辑位置，因此可以直接继续输入。
- 注册 `Base` 后，可通过 gap cursor 将光标放在分割线前后。
