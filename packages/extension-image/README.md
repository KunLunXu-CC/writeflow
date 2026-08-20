# @kunlunxu/wf-extension-image

通过 `resolveUrl` 将图片节点中保存的资源 key 转换为展示地址：

```ts
import { Image } from '@kunlunxu/wf-extension-image';

Image.addOptions({
  resolveUrl: (src) => (/^(https?:|data:|blob:)/.test(src) ? src : `https://example.com/${src}`),
});
```

`resolveUrl` 仅影响渲染，不修改节点的 `attrs.src`；未配置时保持原有行为。
