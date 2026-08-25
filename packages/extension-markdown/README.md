# @kunlunxu/wf-extension-markdown

Markdown 转换扩展，支持 Markdown 与 ProseMirror 文档之间的双向转换，也支持在浏览器中插入 Markdown 和批量转换 WriteFlow JSON。

底层基于官方 `prosemirror-markdown`，转换时直接使用目标 WriteFlow schema，不经过 HTML 或 DOM。

## 注册

```ts
import { Markdown } from '@kunlunxu/wf-extension-markdown';

const extensions = [Markdown];
```

浏览器端解析会根据当前编辑器 schema 创建内容，因此还需要注册 Markdown 中可能出现的标题、列表、表格、代码、链接、图片等节点扩展。

## 浏览器端

```ts
writeFlow.commands.insertMarkdown({
  markdownText: '# 标题\n\n- 列表项',
});

writeFlow.commands.initDocFromMarkdown({
  markdownText: '# 新文档',
});
```

### Commands

| 命令                                    | 行为                                    |
| --------------------------------------- | --------------------------------------- |
| `insertMarkdown({ markdownText })`      | 将 Markdown 解析为 Slice 并替换当前选区 |
| `initDocFromMarkdown({ markdownText })` | 用解析结果替换整个文档内容              |

### Helpers

```ts
const slice = writeFlow.helpers.getSliceFromMarkdown({
  markdownText: '# 标题',
});
```

`getSliceFromMarkdown()` 的处理链路是 Markdown → markdown-it Token → 当前 schema 的 ProseMirror Slice。

## 转换函数

使用 `core` 入口，避免加载 DOM 和 CSS：

```ts
import { markdownToWriteFlowJSON } from '@kunlunxu/wf-extension-markdown/core';

const content = markdownToWriteFlowJSON({
  markdownText: '# 标题\n\n- [x] 已完成',
});
```

如需直接返回对象：

```ts
import { markdownToWriteFlowValue } from '@kunlunxu/wf-extension-markdown/core';

const value = markdownToWriteFlowValue({
  markdownText: '# 标题',
});
```

Node 端不传 `schema` 时会使用包内置的纯转换 schema，不会加载 DOM 或 CSS。如果需要严格匹配某个编辑器实例，也可以显式传入该编辑器的 schema。

如需直接得到经过 schema 校验的 ProseMirror `Node`：

```ts
import { markdownToProseMirrorNode } from '@kunlunxu/wf-extension-markdown/core';

const doc = markdownToProseMirrorNode({
  markdownText: '# 标题',
});
```

## ProseMirror Node 转 Markdown

```ts
import { proseMirrorNodeToMarkdown } from '@kunlunxu/wf-extension-markdown/core';

const markdown = proseMirrorNodeToMarkdown({
  node: writeFlow.state.doc,
});
```

默认使用严格模式。如果文档包含未注册序列化规则的自定义节点或 mark，会抛出错误，避免静默丢失数据。确认允许忽略未知结构时可以传入 `strict: false`：

```ts
const markdown = proseMirrorNodeToMarkdown({
  node: writeFlow.state.doc,
  strict: false,
});
```

## 批量转换示例

```ts
import { readFile, writeFile } from 'node:fs/promises';
import { markdownToWriteFlowJSON } from '@kunlunxu/wf-extension-markdown/core';

const docs = JSON.parse(await readFile('./history-docs.json', 'utf8')) as Array<{
  id: string;
  markdown: string;
}>;

const result = docs.map((doc) => ({
  id: doc.id,
  content: markdownToWriteFlowJSON({
    markdownText: doc.markdown,
  }),
}));

await writeFile('./writeflow-docs.json', JSON.stringify(result, null, 2), 'utf8');
```

## 支持范围

标题、段落、引用、无序列表、有序列表、任务列表、表格、代码块、行内代码、链接、硬换行、分割线、独立图片。

兼容裸任务列表：

```md
[x] 已完成
[ ] 未完成
```

如果 schema 注册了 `strong` / `em` mark，会保留对应格式；否则保留内部文本。

其他转换细节：

- fenced code 的第一个 info 单词写入 `code_block.attrs.language`。
- 行内代码写入 `inline_code` mark。
- 链接写入 `link` mark，并保留 `href` 和 `title`。
- Markdown hard break 转为 `hard_break`；soft break 转为文本换行符 `\n`。
- 独立图片段落转为块级 `image`；段落、标题或表格单元格里的图片退化为 alt 文本。
- 解析结果由目标 schema 创建和校验，缺少对应节点时会尽量降级为文本或扁平内容。
- 序列化表格时，第一行会作为 Markdown 表头输出；Markdown 无法完整表达跨行、跨列和单元格块结构。

## 快捷键、换行和退出

本包不注册任何快捷键、输入规则或编辑器交互插件。导入完成后的 `Enter`、`Shift-Enter`、列表退出、代码块退出和表格导航，由对应节点扩展处理。

## 当前限制

- `initDocFromMarkdown()` 会直接替换整个文档，不保留旧选区内容。
- 默认序列化器遇到未知节点或 mark 会抛出错误；可使用 `strict: false` 仅渲染已知内容。
