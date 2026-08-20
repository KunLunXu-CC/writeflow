# @kunlunxu/wf-extension-link

提供 `link` mark、Markdown 风格链接输入规则和链接打开交互。

## 注册

```ts
import { Link } from '@kunlunxu/wf-extension-link';

const extensions = [Link];
```

## 输入规则

输入以下格式后会转换为链接：

```text
[显示文字](https://example.com)
[显示文字](https://example.com "可选标题")
```

限制：

- 地址只接受 `http://` 或 `https://`。
- 地址不能包含空白或右括号。
- 标题必须使用双引号。
- 转换后只保存 `href`，当前输入规则没有把可选标题写入 `title` 属性。

## 继续输入和退出链接

链接 mark 使用 `inclusive: false`，输入规则转换后也会清除 stored mark。光标位于链接末尾时，可以直接继续输入普通文本，不会延长链接范围。

## 快捷操作

| 操作           | 行为                                                 |
| -------------- | ---------------------------------------------------- |
| `Alt-点击链接` | 使用 `window.open(..., '_blank')` 在新标签页打开链接 |

普通点击不会打开链接，避免干扰编辑和光标定位。

本包没有注册键盘快捷键，也没有公开创建、更新、取消或切换链接的 command。

## HTML

- 输出为 `<a class="wf-link" href="...">`。
- 可以从 `a[href]` 解析 `href` 和 `title`。
- schema 支持 `title`，但当前输入规则只写入 `href`。
