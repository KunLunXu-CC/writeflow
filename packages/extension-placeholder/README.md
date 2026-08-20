# @kunlunxu/wf-extension-placeholder

该目录目前是预留目录，不是可发布包。

## 当前状态

- 没有 `package.json`。
- `src` 目录中没有实现文件。
- 没有导出扩展、schema、command、helper、输入规则、插件或 NodeView。
- 没有注册任何快捷键。

WriteFlow 当前实际使用的占位文案能力位于 `@kunlunxu/wf-core`：

```ts
const writeFlow = new WriteFlow({
  element,
  placeholder: '开始输入...',
});

writeFlow.setPlaceholder('新的占位文案');
```

占位文案只在文档仅包含一个空文本块时显示。此预留目录不需要加入 `extensions`。
