import { Node } from '@/components/WriteFlow/core/Node';
import { nodes as basicNodes } from 'prosemirror-schema-basic';
import { ImageDropPastePlugin } from './createImageDropPastePlugin';
import { buildImagePlaceholderPlugin } from './ImagePlaceholderPlugin';

import { insertImageByFile, insertImageByUrl } from './commands';

/**
 * This extension allows you to create images.
 * @see https://www.tiptap.dev/api/nodes/image
 */
export const Image = Node.create({
  name: 'image',

  // 决定了如果渲染节点
  addSchema: () => {
    return basicNodes.image;
  },

  addCommands: ({ writeFlow }) => {
    return {
      insertImageByUrl: (options) => insertImageByUrl(writeFlow, options),
      insertImageByFile: (options) => insertImageByFile(writeFlow, options),
    };
  },

  addPlugins: ({ writeFlow }) => {
    return [
      new ImageDropPastePlugin({ writeFlow }),
      buildImagePlaceholderPlugin(writeFlow),
    ];
  },
});
