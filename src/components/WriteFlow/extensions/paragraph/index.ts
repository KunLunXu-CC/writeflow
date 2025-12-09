import { Node } from '@/components/WriteFlow/core/Node';
import { nodes as basicNodes } from 'prosemirror-schema-basic';
import { insertParagraphBelow, insertParagraphAbove } from './commands';

/**
 * This extension allows you to create paragraphs.
 * @see https://www.tiptap.dev/api/nodes/paragraph
 */
export const Paragraph = Node.create({
  name: 'paragraph',

  // 决定了如果渲染节点
  addSchema: () => {
    return basicNodes.paragraph;
  },

  // 注册命令, 供外部调用: writeFlow.commands.insertParagraphAfter()
  addCommands: ({ writeFlow, extension }) => {
    return {
      insertParagraphBelow: () => insertParagraphBelow({ writeFlow, extension }),
      insertParagraphAbove: () => insertParagraphAbove({ writeFlow, extension }),
    };
  },

  // 添加快捷键
  addKeymap: ({ writeFlow }) => {
    return {
      'Mod-Enter': () => writeFlow.commands.insertParagraphBelow(), // Ctrl/Cmd + Enter: 在下方插入段落
      'Mod-Shift-Enter': () => writeFlow.commands.insertParagraphAbove(), // Ctrl/Cmd + Shift + Enter: 在上方插入段落
    };
  },
});
