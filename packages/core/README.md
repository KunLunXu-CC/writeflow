# @kunlunxu/wf-core

WriteFlow 的编辑器内核，负责创建 ProseMirror `Schema`、`EditorState` 和 `EditorView`，并统一装配扩展提供的节点、标记、命令、辅助函数、输入规则、快捷键、插件和 NodeView。

## 核心能力

- `WriteFlow`：创建、配置和销毁编辑器实例。
- `Node`、`Mark`、`Extendable`：定义节点、标记和无 schema 扩展。
- `ExtensionManager`：收集扩展能力并创建 schema、插件和 NodeView。
- `WFNodeView`：用 React 组件实现 ProseMirror NodeView。
- `useCreateWriteFlow`：在 React 中创建和销毁编辑器。
- `WriteFlowContext`、`useWriteFlowContext`：向工具栏、菜单等组件传递实例。
- `EventEmitter`：提供 `on`、`once`、`off`、`emit` 和 `removeAllListeners`。
- 动态占位文案、明暗主题和只读模式。
- 运行时注册、注销 ProseMirror 插件。
- 不依赖浏览器 DOM 的 `createWriteFlowSchema()`，可供服务端转换使用。

## 基本用法

```tsx
import { THEME, WriteFlowContext, useCreateWriteFlow } from '@kunlunxu/wf-core';

const Editor = () => {
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow({
    extensions: [],
    placeholder: '开始输入...',
    theme: THEME.LIGHT,
  });

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div ref={writeFlowDomRef} />
    </WriteFlowContext.Provider>
  );
};
```

## WriteFlow API

| API                                      | 作用                               |
| ---------------------------------------- | ---------------------------------- |
| `setTheme(theme)`                        | 切换 `wf-light` / `wf-dark` 主题类 |
| `setPlaceholder(value)`                  | 更新字符串或函数形式的占位文案     |
| `setReadOnly(readOnly)`                  | 动态切换只读状态                   |
| `registerPlugin(plugin, handlePlugins?)` | 动态注册 ProseMirror 插件          |
| `unregisterPlugin(plugin)`               | 注销插件                           |
| `destroy()`                              | 销毁视图并移除事件监听             |
| `commands`                               | 所有扩展注册的命令集合             |
| `helpers`                                | 所有扩展注册的辅助函数集合         |
| `state`                                  | 当前 `EditorState`                 |
| `schema`                                 | 当前 ProseMirror `Schema`          |
| `dispatch`                               | 当前视图的事务派发函数             |
| `isReadOnly`                             | 当前是否只读                       |

## 默认快捷键

`ExtensionManager` 无条件注册 `prosemirror-commands` 的 `baseKeymap`。`Mod` 在 macOS 上表示 `Cmd`，其他平台表示 `Ctrl`。

| 快捷键            | 行为                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| `Enter`           | 按顺序尝试：代码节点内换行、在块节点附近创建段落、退出空块、拆分当前文本块 |
| `Mod-Enter`       | 尝试退出 `code: true` 的代码块；可能被其他扩展的同名快捷键覆盖             |
| `Backspace`       | 删除选区；否则向后合并内容或选中前一个节点                                 |
| `Mod-Backspace`   | 与 `Backspace` 相同，不是按单词删除                                        |
| `Shift-Backspace` | 与 `Backspace` 相同                                                        |
| `Delete`          | 删除选区；否则向前合并内容或选中后一个节点                                 |
| `Mod-Delete`      | 与 `Delete` 相同                                                           |
| `Mod-a`           | 全选文档                                                                   |

macOS 的 `baseKeymap` 还包含以下兼容键位：

| 快捷键               | 行为                       |
| -------------------- | -------------------------- |
| `Ctrl-h`             | 等同 `Backspace`           |
| `Alt-Backspace`      | 等同 `Mod-Backspace`       |
| `Ctrl-d`             | 等同 `Delete`              |
| `Ctrl-Alt-Backspace` | 等同 `Mod-Delete`          |
| `Alt-Delete`         | 等同 `Mod-Delete`          |
| `Alt-d`              | 等同 `Mod-Delete`          |
| `Ctrl-a`             | 将光标移动到当前文本块开头 |
| `Ctrl-e`             | 将光标移动到当前文本块结尾 |

撤销和重做虽然依赖内核注册的 history 插件，但对应快捷键和公开命令由 `@kunlunxu/wf-extension-base` 提供。

## 换行与退出规则

- 普通 `Enter` 由基础 keymap 处理，通常会拆分当前段落或文本块。
- `Shift-Enter` 默认没有特殊行为；注册 `@kunlunxu/wf-extension-hard-break` 后才会插入硬换行。
- 代码块、列表、表格等结构可以覆盖 `Enter`、方向键或 `Tab`，具体规则见对应扩展 README。
- 多个扩展绑定同一快捷键时，第一个返回 `true` 的命令会阻止后续处理。当前 keymap 通过 `unshift` 装配，冲突行为还会受到扩展传入顺序影响，应避免重复绑定同一键位。

## 扩展接口

扩展可提供以下字段：

| 字段            | 作用                          |
| --------------- | ----------------------------- |
| `addSchema`     | 注册 `NodeSpec` 或 `MarkSpec` |
| `addCommands`   | 注册到 `writeFlow.commands`   |
| `addHelpers`    | 注册到 `writeFlow.helpers`    |
| `addInputRules` | 注册文本输入规则              |
| `addKeymap`     | 注册快捷键命令                |
| `addPlugins`    | 注册 ProseMirror 插件         |
| `nodeView`      | 注册自定义 NodeView           |

## 当前限制

- `commands` 和 `helpers` 的公开类型是动态 `Record<string, ...>`，IDE 无法根据已注册扩展推导具体命令名称。
- 内核只内置 `doc`、`text`、`paragraph` 基础 schema；完整编辑能力依赖相应扩展。
- `setTheme()`、`setPlaceholder()` 和 `setReadOnly()` 会更新运行时状态，但其他初始化选项不会自动响应外部对象突变。
