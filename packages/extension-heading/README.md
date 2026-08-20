# @kunlunxu/wf-extension-heading

提供 `heading` 节点和 Markdown 风格的标题输入规则。

## 注册与配置

```ts
import { Heading } from '@kunlunxu/wf-extension-heading';

Heading.addOptions({
  levels: [1, 2, 3, 4, 5, 6],
});

const extensions = [Heading];
```

默认支持一到六级标题，并序列化为 `<h1>` 至 `<h6>`。

## 输入规则

在文本块开头输入井号和空格会转换为标题：

| 输入      | 结果     |
| --------- | -------- |
| `# `      | 一级标题 |
| `## `     | 二级标题 |
| `### `    | 三级标题 |
| `#### `   | 四级标题 |
| `##### `  | 五级标题 |
| `###### ` | 六级标题 |

可识别范围由 `levels` 的第一个值和最后一个值构造，因此建议传入升序且连续的级别数组。

## 快捷键、换行与退出

本包没有注册标题快捷键，源码中设想的 `Mod-Alt-1` 至 `Mod-Alt-6` 尚未实现。

- 在标题中间按 `Enter`，core 通常会拆分出另一个同级标题。
- 在标题末尾按 `Enter`，core 通常会创建普通段落，从标题中退出。
- 注册 `HardBreak` 后，`Shift-Enter` 会在标题节点内部插入硬换行。

## 当前限制

- 没有 `setHeading`、`toggleHeading` 或转回段落的公开命令。
- `HTMLAttributes` 虽然出现在选项类型中，但当前 `toDOM` 没有读取它，配置后不会渲染到标题 DOM。
- 非连续 `levels` 会被输入规则按首尾范围处理，例如 `[1, 3]` 仍可能识别二级标题。
