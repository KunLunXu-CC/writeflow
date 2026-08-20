# Mention 扩展

Mention 扩展提供类似 Tiptap Mention 的唤起建议能力：

- 支持自定义唤起字符。
- 支持在同一个编辑器中配置多个唤起字符。
- 支持同步或异步候选项。
- 支持通过 React 组件渲染候选面板。
- 选中后会插入原子 Mention 节点，并将 `id`、`label`、`char` 保存到文档 JSON。

```tsx
import { createMention, type MentionSuggestionRenderProps } from '@kunlunxu/wf-extension-mention';

const MentionList = ({ items, selectedIndex, select }: MentionSuggestionRenderProps) => (
  <div>
    {items.map((item, index) => (
      <button
        key={item.id}
        type="button"
        className={selectedIndex === index ? 'selected' : undefined}
        onMouseDown={(event) => {
          event.preventDefault();
          select(item);
        }}
      >
        {item.label || item.id}
      </button>
    ))}
  </div>
);

const Mention = createMention({
  suggestions: [
    {
      char: '@',
      items: async ({ query, signal }) => searchUsers(query, signal),
      render: MentionList,
    },
    {
      char: '#',
      items: ({ query }) => searchTopics(query),
      render: MentionList,
    },
  ],
});
```

## 只读模式

创建编辑器时传入 `readOnly: true`，也可以通过 `writeFlow.setReadOnly()` 动态切换：

```ts
const writeFlow = new WriteFlow({
  element,
  extensions: [Mention],
  readOnly: true,
});

writeFlow.setReadOnly(false);
```
