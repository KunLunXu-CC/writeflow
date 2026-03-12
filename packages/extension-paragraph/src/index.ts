import { Node } from '@kunlunxu/wf-core';
import { nodes as basicNodes } from 'prosemirror-schema-basic';
import { insertParagraphBelow, insertParagraphAbove } from './commands';
import { NodeSpec } from 'prosemirror-model';
import './index.scss';

/**
 * This extension allows you to create paragraphs.
 * @see https://www.tiptap.dev/api/nodes/paragraph
 */
export const Paragraph = Node.create({
  name: 'paragraph',

  // 决定了如果渲染节点
  addSchema: (): NodeSpec => ({
    ...basicNodes.paragraph,
    toDOM: () => ['p', { class: 'wf-paragraph' }, 0],
  }),

  // 注册命令, 供外部调用: writeFlow.commands.insertParagraphAfter()
  addCommands: ({ writeFlow, extension }) => ({
    insertParagraphBelow: () => insertParagraphBelow({ writeFlow, extension }),
    insertParagraphAbove: () => insertParagraphAbove({ writeFlow, extension }),
  }),

  // 添加快捷键
  addKeymap: ({ writeFlow }) => ({
    'Mod-Enter': () => writeFlow.commands.insertParagraphBelow(), // Ctrl/Cmd + Enter: 在下方插入段落
    'Mod-Shift-Enter': () => writeFlow.commands.insertParagraphAbove(), // Ctrl/Cmd + Shift + Enter: 在上方插入段落
  }),
});
