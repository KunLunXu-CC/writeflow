import { Extendable } from '@/components/WriteFlow/core/Extendable';
import { parserMarkdownToDoc, ParserMarkdownToDocOptions } from './helpers';

/**
 * This extension allows you to create blockquote.
 * @see https://www.tiptap.dev/api/nodes/blockquote
 */
export const Markdown = Extendable.create({
  name: 'markdown',
  addHelpers: ({ writeFlow, extension }) => ({
    parserMarkdownToDoc: parserMarkdownToDoc.bind(null, { writeFlow, extension }),
  }),
});
