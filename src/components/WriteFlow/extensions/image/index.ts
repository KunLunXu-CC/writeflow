import { Node } from '@/components/WriteFlow/core/Node';
import { ImageDropPastePlugin } from './ImageDropPastePlugin';
import { insertImageByFile, insertImageByUrl, setImageByUploadId } from './commands';
import { NodeSpec } from 'prosemirror-model';
import './index.scss';

export interface ImageExtensionOptions {
  upload?: (args: { file: File }) => Promise<{ url: string }>;
}

/**
 * This extension allows you to create images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const Image = Node.create<ImageExtensionOptions>({
  name: 'image',

  // 决定了如果渲染节点
  addSchema: () => {
    return {
      inline: true,
      group: 'inline',
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
      },
      parseDOM: [
        {
          tag: 'img[src]',
        },
      ],
      toDOM: (node) => {
        return ['img', { ...node.attrs, class: 'wf-image' }];
      },
    } as NodeSpec;
  },

  addCommands: ({ writeFlow, extension }) => {
    return {
      insertImageByUrl: (options) => insertImageByUrl({ writeFlow, extension }, options),
      insertImageByFile: (options) => insertImageByFile({ writeFlow, extension }, options),
      setImageByUploadId: (options) => setImageByUploadId({ writeFlow, extension }, options),
    };
  },

  addPlugins: ({ writeFlow }) => {
    return [new ImageDropPastePlugin({ writeFlow })];
  },
});
