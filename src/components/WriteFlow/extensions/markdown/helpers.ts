import MarkdownIt from 'markdown-it';
import { WFHelper } from '../../types';
import { MarkdownParser } from 'prosemirror-markdown';
import { Node } from 'prosemirror-model';

const markdownIt = new MarkdownIt();

export interface ParserMarkdownToDocOptions {
  markdownText: string;
}

/**
 * 将 Markdown 文本解析为 ProseMirror 的文档结构（Node）
 */
export const parserMarkdownToDoc: WFHelper<Node> = (
  { writeFlow },
  opts: ParserMarkdownToDocOptions,
) => {
  const { markdownText } = opts;
  const parser = new MarkdownParser(writeFlow.schema, markdownIt, {
    // ========== Nodes 映射 ==========

    // ========== Nodes 映射 ==========
    blockquote: { block: 'blockquote' },
    paragraph: { block: 'paragraph' },
    list_item: { block: 'list_item' },
    bullet_list: { block: 'bullet_list' },
    ordered_list: { block: 'ordered_list' },
    heading: {
      block: 'heading',
      getAttrs: (tok) => ({ level: +tok.tag.slice(1) }),
    },
    code_block: { block: 'code_block', noCloseToken: true },
    fence: {
      block: 'code_block',
      getAttrs: (tok) => ({ language: tok.info || null }),
      noCloseToken: true,
    },
    hr: { node: 'horizontal_rule' },
    image: {
      node: 'image',
      getAttrs: (tok) => ({
        src: tok.attrGet('src'),
        alt: tok.content || '',
        title: tok.attrGet('title') || null,
      }),
    },
    hardbreak: { node: 'hard_break' },

    // ========== Marks 映射 ==========
    // em: { mark: 'em' },
    // em123: { mark: 'em' },
    // strong: { mark: 'strong' },
    // link: {
    //   mark: 'link',
    //   getAttrs: (tok) => ({
    //     href: tok.attrGet('href'),
    //     title: tok.attrGet('title') || null,
    //   }),
    // },
    code_inline: { mark: 'inline_code' },
    em: { ignore: true },
    strong: { ignore: true },
    link: { ignore: true },
  });

  const doc = parser.parse(markdownText);

  return doc;
};
