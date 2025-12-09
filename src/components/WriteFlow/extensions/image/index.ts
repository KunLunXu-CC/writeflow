import { Node } from '@/components/WriteFlow/core/Node';
import { ImageDropPastePlugin } from './ImageDropPastePlugin';
import { insertImageByFile, insertImageByUrl, setImageByUploadId } from './commands';
import { NodeSpec } from 'prosemirror-model';

/**
 * This extension allows you to create images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const Image = Node.create({
  name: 'image',

  // 决定了如果渲染节点
  addSchema: () => {
    return {
      inline: true,
      group: 'inline',
      // 定义节点属性
      attrs: {
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
        return ['div', { 'data-image-wrapper': true }, ['img', { ...node.attrs }]];
      },
    } as NodeSpec;
  },

  addCommands: ({ writeFlow }) => {
    return {
      insertImageByUrl: (options) => insertImageByUrl(writeFlow, options),
      insertImageByFile: (options) => insertImageByFile(writeFlow, options),
      setImageByUploadId: (options) => setImageByUploadId(writeFlow, options),
    };
  },

  addPlugins: ({ writeFlow }) => {
    return [new ImageDropPastePlugin({ writeFlow })];
  },
});
