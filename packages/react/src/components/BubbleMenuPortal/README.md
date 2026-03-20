# BubbleMenuPortal

`BubbleMenuPortal` 是 `@kunlunxu/wf-react` 提供的一个 React 包装组件，用来把气泡菜单内容渲染到编辑器选区附近。

它本身不负责菜单内容，只负责：

- 创建一个供 React Portal 挂载的 DOM 节点
- 注册 `@kunlunxu/wf-extension-bubble-menu` 插件
- 在选区变化时把 `children` 渲染到对应位置

## 如何使用 BubbleMenuPortal

使用 `BubbleMenuPortal` 时需要满足两个前提：

- 组件必须渲染在 `WriteFlowContext.Provider` 内部，这样它才能拿到当前 `writeFlow` 实例
- `children` 必须是单个 `ReactElement`

一个典型用法如下：

```tsx
import { BubbleMenuPortal, WriteFlowContext, useCreateWriteFlow } from '@kunlunxu/wf-react';

const BubbleMenu = () => {

  useEffect(() => {
    // 注意, 当「选取」发生变更时, 整个组件都会重新 render 也就是, 该 useEffect 会被执行
    console.log('当前「选取」发生变更')
  }, [])

  return (
    <div className="bubble-menu">
      自定义菜单内容
    </div>
  )
}

export const Editor = () => {
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow({
    extensions: [],
  });

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div ref={writeFlowDomRef} />
      <BubbleMenuPortal>
        <BubbleMenu />
      </BubbleMenuPortal>
    </WriteFlowContext.Provider>
  );
};
```

建议把 `BubbleMenuPortal` 和编辑器 DOM 放在同一个 Provider 下，作为兄弟节点使用。这样气泡菜单的定位和插件注册都会跟当前编辑器实例保持一致。

## BubbleMenuPortal 触发更新逻辑

`BubbleMenuPortal` 的更新链路可以分成 3 步：

### 1. 初始化 portal 节点并注册插件

组件挂载后会先创建一个 `div` 作为 `portalElement`。

当 `writeFlow` 和 `portalElement` 都准备好后，会调用：

```ts
buildBubbleMenuPlugin({
  element: portalElement,
});
```

然后通过 `writeFlow.registerPlugin(...)` 把这个插件注册到当前编辑器实例上。

### 2. ProseMirror 插件根据选区更新 DOM

`BubbleMenuPluginView.update()` 会在编辑器状态变化时执行：

- 如果当前选区为空，调用 `hide()`，把菜单节点从页面上移除
- 如果当前选区非空，调用 `show()`，并做几件事：
  - 把 `portalElement` 挂到编辑器容器下
  - 根据选区的 `from / to` 计算菜单位置
  - 设置 `style.top` 和 `style.left`
  - 设置 `data-range="[from, to]"`

这里的 `data-range` 是 React 侧感知选区变化的关键字段。

### 3. React 侧监听 `data-range`，触发 children 重挂载

`BubbleMenuPortal` 内部使用了一个 `MutationObserver` 监听 `portalElement` 的 `data-range` 属性：

```ts
observer.observe(portalElement, {
  attributes: true,
  attributeFilter: ['data-range'],
});
```

当 `data-range` 变化时，会把它写入本地状态 `renderKey`，然后执行：

```tsx
createPortal(cloneElement(children, { key: renderKey }), portalElement);
```

这意味着：

- 只要选区范围变化，`children` 会因为 `key` 变化而重新挂载
- 如果你的菜单组件依赖当前选区初始化内部状态，这个机制可以确保它拿到最新上下文
- 单纯的显示/隐藏并不会直接触发 React 重挂载，真正触发重挂载的是 `data-range` 变化

## 当前行为说明

基于当前实现，`BubbleMenuPortal` 更适合这类场景：

- 菜单内容需要跟随选区范围变化而刷新
- 菜单组件内部有依赖选区的局部状态，希望在选区切换时重置

如果只是普通展示，不依赖选区范围重置状态，也可以直接使用它；只是需要知道，React 侧的“强制刷新”是通过 `key=data-range` 达成的，而不是额外维护了一套编辑器状态订阅。
