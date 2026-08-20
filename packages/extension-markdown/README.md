# @kunlunxu/wf-extension-markdown

Markdown 导入扩展，支持在浏览器中插入 Markdown，也支持将历史 Markdown 批量转换为 WriteFlow JSON。

## 浏览器端

```ts
writeFlow.commands.insertMarkdown({
  markdownText: '# 标题\n\n- 列表项',
});

writeFlow.commands.initDocFromMarkdown({
  markdownText: '# 新文档',
});
```

## 转换函数

使用 `core` 入口，避免加载 DOM 和 CSS：

```ts
import { markdownToWriteFlowJSON } from '@kunlunxu/wf-extension-markdown/core';

const content = markdownToWriteFlowJSON({
  markdownText: '# 标题\n\n- [x] 已完成',
});
```

返回对象：

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
