# @kunlunxu/wf-extension-image

提供块级图片节点、图片文件粘贴/拖入、本地预览和异步上传能力。

## 注册与配置

```ts
import { Image } from '@kunlunxu/wf-extension-image';

Image.addOptions({
  upload: async ({ file }) => {
    const url = await uploadFile(file);
    return { url };
  },
  resolveUrl: (src) => (/^(https?:|data:|blob:)/.test(src) ? src : `https://example.com/${src}`),
});

const extensions = [Image];
```

`resolveUrl` 仅把节点中的持久化 `src` 转换为展示地址，不修改文档 JSON 中的 `attrs.src`。

## 节点属性

| 属性       | 作用                                          |
| ---------- | --------------------------------------------- |
| `src`      | 持久化图片地址或资源 key                      |
| `alt`      | 图片替代文本数据                              |
| `title`    | 图片标题数据                                  |
| `uploadId` | 上传过程中的临时唯一标识                      |
| `status`   | `upload_ing`、`upload_done` 或 `upload_error` |

当前 DOM 渲染会把 `src` 放到 `<img>`，其他属性放到外层 wrapper；`alt` 和 `title` 当前不会传给内部 `<img>`。

## Commands

### 直接插入

```ts
await writeFlow.commands.insertImage({
  attrs: {
    src: 'https://example.com/image.png',
    alt: '示例图片',
    title: null,
  },
});
```

如果当前位于文档末尾，命令会先追加一个空段落，确保图片后仍有可编辑位置。

### 通过文件插入

```ts
await writeFlow.commands.insertImageByFile({ file });
```

执行流程：

1. 插入带 `uploadId` 和 `upload_ing` 的占位图片节点。
2. 使用 FileReader 读取 Data URL，尽快显示本地预览。
3. 配置了 `upload` 时调用上传函数。
4. 上传完成后用远端 URL 更新同一个图片节点，并设置为 `upload_done`。

### 更新上传节点

```ts
await writeFlow.commands.setImageByUploadId({
  uploadId,
  newAttrs: {
    src: nextUrl,
    status: 'upload_done',
  },
});
```

该属性更新通过 `addToHistory: false` 排除在撤销历史之外。

## 拖拽和粘贴

- 从文件系统拖入图片文件会调用 `insertImageByFile()`。
- 从剪贴板粘贴图片文件会调用 `insertImageByFile()`。
- 一次拖入或粘贴多个图片文件时会逐个插入。
- 编辑器内部节点拖动不会被图片插件当成新上传处理。
- 只处理 MIME 类型以 `image/` 开头的文件。

## 快捷键和退出

本包不注册专属快捷键。

- 图片是无内容的块级叶子节点，可通过普通 NodeSelection 选中。
- 选中图片后，core 的 `Backspace` 或 `Delete` 可以删除图片节点。
- `insertImage()` 会在文档末尾补段落，因此通过该命令插入后可以移动到图片后继续输入。
- 注册 `Base` 后，可通过 gap cursor 在图片前后定位。

## 当前限制

- 没有图片上传失败的 `catch` 处理；`upload` 抛错后状态不会自动更新为 `upload_error`。
- 没有替换图片、设置 alt/title、缩放或对齐的独立 UI 和快捷键。
- `insertImageByFile()` 不限制文件大小、像素尺寸或数量。
