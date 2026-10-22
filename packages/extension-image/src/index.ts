import { Node } from '@kunlunxu/wf-core';
import { ImageDropPastePlugin } from './ImageDropPastePlugin';
import { insertImageByFile, insertImage, setImageByUploadId } from './commands';
import { NodeSpec } from 'prosemirror-model';
import { ImageNodeView } from './ImageNodeView';
import './index.scss';

export interface ImageExtensionOptions {
  upload?: (args: { file: File }) => Promise<{ url: string }>;
  /** 将节点中持久化的图片地址转换为仅用于展示的地址 */
  resolveUrl?: (src: string) => string;
}

/**
 * This extension allows you to create images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const Image = Node.create<ImageExtensionOptions>({
  name: 'image',

  nodeView: ImageNodeView,

  // 决定了如果渲染节点
  addSchema: ({ extension }): NodeSpec => ({
    group: 'block',
    // 定义节点属性
    attrs: {
      status: {
        default: null,
        validate: 'string|null',
      },
      uploadId: {
        default: null,
        validate: 'string|null',
      },
      src: {
        default: null,
        validate: 'string|null',
      },
      alt: {
        default: null,
        validate: 'string|null',
      },
      title: {
        default: null,
        validate: 'string|null',
      },
      width: {
        default: null,
        validate: 'number|null',
      },
      align: {
        default: 'left',
        validate: 'string',
      },
    },
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          const image = dom as HTMLImageElement;
          const widthAttr = image.getAttribute('width');
          const width = widthAttr ? Number.parseInt(widthAttr, 10) : null;

          return {
            src: image.src,
            alt: image.alt || null,
            title: image.title || null,
            width: Number.isFinite(width) ? width : null,
          };
        },
      },
    ],
    toDOM: (node) => {
      const { src, alt, title, width, status, align } = node.attrs;
      const displaySrc =
        typeof src === 'string' ? (extension.options?.resolveUrl?.(src) ?? src) : '';

      return [
        'div',
        {
          class: 'wf-image-wrapper',
          'data-align': align,
          'data-upload-status': status,
        },
        [
          'img',
          {
            src: displaySrc,
            alt: alt ?? '',
            title,
            width,
            class: 'wf-image',
          },
        ],
        ['div', { class: 'wf-image-mask' }],
      ];
    },
  }),

  addCommands: ({ writeFlow, extension }) => ({
    insertImage: (options) => insertImage({ writeFlow, extension }, options),
    insertImageByFile: (options) => insertImageByFile({ writeFlow, extension }, options),
    setImageByUploadId: (options) => setImageByUploadId({ writeFlow, extension }, options),
  }),

  addPlugins: ({ writeFlow }) => [new ImageDropPastePlugin({ writeFlow })],
});
