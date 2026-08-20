# @kunlunxu/wf-extension-bubble-menu

提供基于当前编辑器选区定位的 React Bubble Menu。选区非空时显示，选区为空时隐藏。

## React 用法

组件必须位于 `WriteFlowContext.Provider` 内：

```tsx
import { BubbleMenuPortal } from '@kunlunxu/wf-extension-bubble-menu';

<BubbleMenuPortal>
  <div className="bubble-menu">这里放置格式化操作</div>
</BubbleMenuPortal>;
```

`BubbleMenuPortal` 会：

- 创建独立 DOM 容器。
- 向当前 WriteFlow 实例动态注册 Bubble Menu 插件。
- 使用 React Portal 渲染传入元素。
- 在选区范围变化时更新子元素的 `key`，触发所需的 React 更新。
- 卸载时注销插件并移除菜单。

## 直接创建插件

```ts
import { buildBubbleMenuPlugin } from '@kunlunxu/wf-extension-bubble-menu';

const element = document.createElement('div');
const plugin = buildBubbleMenuPlugin({
  element,
  pluginKey: 'myBubbleMenu',
  options: {
    shouldShow: () => true,
    onShow: () => {},
    onHide: () => {},
    onUpdate: () => {},
    onDestroy: () => {},
  },
});

writeFlow.registerPlugin(plugin);
```

## 显示规则

- 选区为空时隐藏。
- 选区非空时显示，并定位在选区顶部上方约 `48px`。

## 快捷键与退出

本包不注册任何快捷键，也不拦截 `Escape`。菜单的按钮键盘导航、关闭逻辑和焦点管理需要由使用方实现。

## 当前限制

- 默认定位未处理视口边缘碰撞、滚动容器偏移和菜单自身尺寸。
- 不区分文本选区、NodeSelection 或 CellSelection，只依据 `selection.empty` 判断。
- 每个菜单必须使用不同的 `pluginKey`，否则会发生插件 key 冲突。
- `options.shouldShow` 虽然已经定义，但当前 `update()` 没有调用它，暂时不能通过该回调控制显示。
