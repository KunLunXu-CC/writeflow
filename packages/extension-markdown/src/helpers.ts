import { WFHelper } from '@kunlunxu/wf-core';
import { Slice } from 'prosemirror-model';
import { DOMParser } from 'prosemirror-model';
import { renderMarkdownToHtml } from './markdown';

export interface ParserMarkdownToDocOptions {
  markdownText: string;
}

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
  const html = renderMarkdownToHtml(markdownText);

  // 2. HTML -> DOM
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 3. DOM -> ProseMirror Slice (自动根据 schema 匹配)
  const slice = DOMParser.fromSchema(schema).parseSlice(tempDiv);
  // console.log('%c [ getSliceFromMarkdown ]-96', 'font-size:13px; background:pink; color:#bf2c9f;', {
  //   html,
  //   slice,
  //   markdownText,
  // });
  return slice;
};
