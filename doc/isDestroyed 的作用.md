在 tiptap（其实底层用的是 ProseMirror 的 EditorView）中，
isDestroyed 表示 当前编辑器实例是否已经被销毁。

👉 具体解释：

Tiptap 内部有个 Editor 类，它会持有 ProseMirror 的 EditorView。

当你调用 editor.destroy() 时，内部会清理各种插件、事件监听、DOM 绑定等资源。

此时 editor.isDestroyed 就会被置为 true，用来标识该实例已经不可再使用。

用途上：

防止你在已经销毁的 editor 上继续调用 API（否则可能报错，比如 editor.chain().focus().run()）。

在一些异步逻辑里，可以用 if (editor.isDestroyed) return; 来避免对已销毁实例做操作。

简单比喻：
isDestroyed = true → 这台「编辑器机器」已经关机/报废了，不能再操作。

要不要我帮你贴一下 Editor 里 isDestroyed 的实现源码？