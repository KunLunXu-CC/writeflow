import type { WriteFlowValue } from '@kunlunxu/wf-core';
import type { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { MarkdownParser, type ParseSpec } from 'prosemirror-markdown';
import { createMarkdownTokenizer, preprocessMarkdown } from './markdown';
import { writeFlowMarkdownSchema } from './schema';

export interface MarkdownToProseMirrorNodeOptions {
  markdownText: string;
  schema?: Schema;
}

export type MarkdownToWriteFlowValueOptions = MarkdownToProseMirrorNodeOptions;

export interface MarkdownToWriteFlowJSONOptions extends MarkdownToWriteFlowValueOptions {
  space?: number;
}

const parserCache = new WeakMap<Schema, MarkdownParser>();

const blockSpec = (schema: Schema, name: string): ParseSpec =>
  schema.nodes[name] ? { block: name } : { ignore: true };

const nodeSpec = (schema: Schema, name: string): ParseSpec =>
  schema.nodes[name] ? { node: name } : { ignore: true, noCloseToken: true };

const markSpec = (schema: Schema, name: string): ParseSpec =>
  schema.marks[name] ? { mark: name } : { ignore: true };

/** 创建与指定 WriteFlow Schema 匹配的 Markdown 解析器。 */
export const createWriteFlowMarkdownParser = (schema: Schema) => {
  const cachedParser = parserCache.get(schema);

  if (cachedParser) {
    return cachedParser;
  }

  const parser = new MarkdownParser(schema, createMarkdownTokenizer(schema), {
    blockquote: blockSpec(schema, 'blockquote'),
    paragraph: blockSpec(schema, 'paragraph'),
    image_paragraph: { ignore: true },
    list_item: blockSpec(schema, 'list_item'),
    task_item: schema.nodes.task_item
      ? {
          block: 'task_item',
          getAttrs: (token) => ({ checked: token.attrGet('checked') === 'true' }),
        }
      : { ignore: true },
    bullet_list: blockSpec(schema, 'bullet_list'),
    task_list: blockSpec(schema, 'task_list'),
    ordered_list: schema.nodes.ordered_list
      ? {
          block: 'ordered_list',
          getAttrs: (token) => ({ order: Number(token.attrGet('start')) || 1 }),
        }
      : { ignore: true },
    heading: schema.nodes.heading
      ? {
          block: 'heading',
          getAttrs: (token) => ({ level: Number(token.tag.slice(1)) || 1 }),
        }
      : { ignore: true },
    code_block: schema.nodes.code_block
      ? {
          block: 'code_block',
          attrs: { language: null },
          noCloseToken: true,
        }
      : { ignore: true, noCloseToken: true },
    fence: schema.nodes.code_block
      ? {
          block: 'code_block',
          getAttrs: (token) => ({
            language: token.info.trim().split(/\s+/)[0] || null,
          }),
          noCloseToken: true,
        }
      : { ignore: true, noCloseToken: true },
    text_block: {
      block: 'paragraph',
      noCloseToken: true,
    },
    hr: nodeSpec(schema, 'horizontal_rule'),
    table: blockSpec(schema, 'table'),
    tr: blockSpec(schema, 'table_row'),
    th: blockSpec(schema, 'table_header'),
    td: blockSpec(schema, 'table_cell'),
    thead: { ignore: true },
    tbody: { ignore: true },
    image: schema.nodes.image
      ? {
          node: 'image',
          getAttrs: (token) => ({
            src: token.attrGet('src'),
            alt: token.content || token.attrGet('alt'),
            title: token.attrGet('title'),
          }),
        }
      : { ignore: true, noCloseToken: true },
    hardbreak: nodeSpec(schema, 'hard_break'),
    html_block: { ignore: true, noCloseToken: true },
    checkbox_input: { ignore: true, noCloseToken: true },
    label: { ignore: true },
    em: markSpec(schema, 'em'),
    strong: markSpec(schema, 'strong'),
    link: schema.marks.link
      ? {
          mark: 'link',
          getAttrs: (token) => ({
            href: token.attrGet('href') || '',
            title: token.attrGet('title'),
          }),
        }
      : { ignore: true },
    code_inline: schema.marks.inline_code
      ? {
          mark: 'inline_code',
          noCloseToken: true,
        }
      : { ignore: true, noCloseToken: true },
  });

  parserCache.set(schema, parser);

  return parser;
};

/** 将 Markdown 转换为经过目标 Schema 校验的 ProseMirror 文档节点。 */
export const markdownToProseMirrorNode = ({
  markdownText,
  schema = writeFlowMarkdownSchema,
}: MarkdownToProseMirrorNodeOptions): ProseMirrorNode => {
  return createWriteFlowMarkdownParser(schema).parse(preprocessMarkdown(markdownText));
};

/** 将 Markdown 转换为 WriteFlow JSON 对象。 */
export const markdownToWriteFlowValue = (
  options: MarkdownToWriteFlowValueOptions,
): WriteFlowValue => {
  return markdownToProseMirrorNode(options).toJSON();
};

/** 将 Markdown 转换为 WriteFlow JSON 字符串。 */
export const markdownToWriteFlowJSON = (options: MarkdownToWriteFlowJSONOptions) => {
  const { space, ...restOptions } = options;

  return JSON.stringify(markdownToWriteFlowValue(restOptions), null, space);
};
