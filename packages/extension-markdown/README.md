# @kunlunxu/wf-extension-markdown

Markdown 导入扩展，支持在浏览器中插入 Markdown，也支持将历史 Markdown 批量转换为 WriteFlow JSON。

本包只负责 Markdown 到 WriteFlow 的单向导入，不提供 WriteFlow JSON 到 Markdown 的导出。

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

`getSliceFromMarkdown()` 的处理链路是 Markdown → HTML → DOM → 当前 schema 的 ProseMirror Slice，因此只能在浏览器 DOM 环境中使用。

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

当前不会生成 `strong` / `em` mark，因为 WriteFlow 暂未提供对应扩展。

其他转换细节：

- fenced code 的第一个 info 单词写入 `code_block.attrs.language`。
- 行内代码写入 `inline_code` mark。
- 链接写入 `link` mark，并保留 `href` 和 `title`。
- Markdown hard break 转为 `hard_break`；soft break 转为文本换行符 `\n`。
- 独立图片段落转为块级 `image`；段落、标题或表格单元格里的图片退化为 alt 文本。
- `strong` 和 `em` token 会被忽略格式，但保留内部文本。
- 空文档和空容器会补一个空段落，保证 schema 有有效块内容。

## 快捷键、换行和退出

本包不注册任何快捷键、输入规则或编辑器交互插件。导入完成后的 `Enter`、`Shift-Enter`、列表退出、代码块退出和表格导航，由对应节点扩展处理。

## 当前限制

- 浏览器端 `getSliceFromMarkdown()` 依赖 `document`，Node 环境应使用 `@kunlunxu/wf-extension-markdown/core`。
- `initDocFromMarkdown()` 会直接替换整个文档，不保留旧选区内容。
- 解析结果包含当前 schema 未注册的节点或 mark 时，浏览器 DOM 解析可能丢弃相应结构或格式。
