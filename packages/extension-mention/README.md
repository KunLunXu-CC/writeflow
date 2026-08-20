# @kunlunxu/wf-extension-mention

Mention 扩展提供类似 Tiptap Mention 的唤起建议能力：

- 支持自定义唤起字符。
- 支持在同一个编辑器中配置多个唤起字符。
- 支持同步或异步候选项。
- 支持通过 React 组件渲染候选面板。
- 选中后会插入原子 Mention 节点，并将 `id`、`label`、`char` 保存到文档 JSON。

默认 `Mention` 使用 `@` 和空候选数组。实际业务通常应通过 `createMention()` 创建带候选数据和渲染组件的独立扩展。

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

## 配置能力

| 配置                 | 作用                                         |
| -------------------- | -------------------------------------------- |
| `suggestions`        | 配置多个唤起字符                             |
| `suggestion`         | 单个唤起字符的兼容写法                       |
| `char`               | 唤起字符，默认 `@`                           |
| `items`              | 同步数组或异步候选函数                       |
| `render`             | React 候选面板组件                           |
| `command`            | 自定义选中候选后的插入逻辑                   |
| `allowSpaces`        | 查询是否允许空格，默认不允许                 |
| `allowToIncludeChar` | 查询是否允许再次出现唤起字符，默认不允许     |
| `allowedPrefixes`    | 唤起字符前允许的字符，默认仅空格或文本块开头 |
| `minQueryLength`     | 达到指定查询长度后才加载候选                 |
| `container`          | 面板挂载容器，默认 `document.body`           |
| `pluginKey`          | 自定义 ProseMirror PluginKey                 |
| `renderText`         | 自定义 Mention 节点显示文字                  |

异步 `items` 会收到 `AbortSignal`。查询变化、面板关闭或插件销毁时会中止上一请求，调用方应把该 signal 继续传给请求库。

## 快捷键

只有候选状态激活时才会拦截以下键位：

| 快捷键      | 行为                                                 |
| ----------- | ---------------------------------------------------- |
| `ArrowUp`   | 选择上一个候选，到顶部后循环到底部                   |
| `ArrowDown` | 选择下一个候选，到底部后循环到顶部                   |
| `Enter`     | 插入当前候选                                         |
| `Tab`       | 插入当前候选                                         |
| `Escape`    | 关闭当前候选状态，不删除已经输入的唤起字符和查询文本 |

候选数组为空时，方向键、`Enter` 和 `Tab` 会返回 `false`，继续交给编辑器或浏览器处理。

## 插入后继续输入

默认 command 会：

1. 用原子 `mention` 节点替换唤起字符和查询文本。
2. 在 Mention 后自动插入一个普通空格。
3. 关闭候选状态。

因此选中候选后可以直接继续输入，不需要额外按方向键退出 Mention。

Mention 节点不可直接编辑，也不可单独选择；在其相邻位置使用 `Backspace` 或 `Delete` 时由 core 基础删除行为处理。

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

只读模式下不会激活候选、加载数据或执行默认插入命令。

## 当前限制

- `Escape` 只关闭当前插件状态，不删除触发文本；继续在同一查询后输入时可能再次满足唤起条件。
- 面板仅按光标坐标定位到下方 `4px`，未处理视口边缘碰撞。
- 本包没有公开的“按 ID 插入 Mention” command，程序化插入需自行创建节点事务或提供自定义 suggestion command。
