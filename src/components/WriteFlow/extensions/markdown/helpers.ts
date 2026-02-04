import MarkdownIt from 'markdown-it';
import { WFHelper } from '../../types';
import { MarkdownParser } from 'prosemirror-markdown';
import { Node, Slice } from 'prosemirror-model';
import { DOMParser } from 'prosemirror-model';

const markdownIt = new MarkdownIt();

export interface ParserMarkdownToDocOptions {
  markdownText: string;
}

/**
 * 将 Markdown 文本解析为 ProseMirror 的文档结构（Node）
 */
export const parserMarkdownToDoc: WFHelper<Node, { markdownText: string }> = (
  { writeFlow },
  opts,
) => {
  const { markdownText } = opts || { markdownText: '' };
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

/** 将 MD 转为 ProseMirror Slice */
export const getSliceFromMarkdown: WFHelper<Slice | null, { markdownText: string }> = (
  { writeFlow },
  opts,
) => {
  if (!opts) {
    return null;
  }

  const { markdownText } = opts;
  const { schema } = writeFlow;

  // 1. Markdown -> HTML
  const html = markdownIt.render(markdownText);

  // 2. HTML -> DOM
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 3. DOM -> ProseMirror Slice (自动根据 schema 匹配)
  const slice = DOMParser.fromSchema(schema).parseSlice(tempDiv);

  return slice;
};
