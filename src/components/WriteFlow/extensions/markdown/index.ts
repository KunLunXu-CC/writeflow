import { Extendable } from '@/components/WriteFlow/core/Extendable';
import { getSliceFromMarkdown } from './helpers';
import { insertMarkdown, initDocFromMarkdown } from './commands';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Markdown = Extendable.create({
  name: 'markdown',
  addHelpers: ({ writeFlow, extension }) => ({
    getSliceFromMarkdown: getSliceFromMarkdown.bind(null, { writeFlow, extension }),
  }),

  addCommands: ({ writeFlow, extension }) => ({
    insertMarkdown: insertMarkdown.bind(null, { writeFlow, extension }),
    initDocFromMarkdown: initDocFromMarkdown.bind(null, { writeFlow, extension }),
  }),
});
