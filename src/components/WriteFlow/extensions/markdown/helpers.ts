import MarkdownIt from 'markdown-it';
import { WFHelper } from '../../types';
import { Slice } from 'prosemirror-model';
import { DOMParser } from 'prosemirror-model';
import { tasklist } from '@mdit/plugin-tasklist';

const markdownIt = new MarkdownIt().use(tasklist, {
  containerClass: 'task-list',
});

export interface ParserMarkdownToDocOptions {
  markdownText: string;
}

/**
 * 预处理 markdown 文本, 以确保 Markdown-it 能正确解析:
 * - 任务列表项必须以 '[ ] '、'[x] ' 或 '[X] ' 开头, 处理为标准的以 '- ' 开头的 taskList, 以确保正确识别任务列表项的格式;
 */
const preprocessMarkdown = (markdown: string): string => {
  return markdown.replace(/^([ \t]*?)(\[ \]|\[x\]|\[X\])/gm, '$1- $2');
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
  const processedMarkdown = preprocessMarkdown(markdownText);
  const html = markdownIt.render(processedMarkdown);

  // 2. HTML -> DOM
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 3. DOM -> ProseMirror Slice (自动根据 schema 匹配)
  const slice = DOMParser.fromSchema(schema).parseSlice(tempDiv);
  console.log('%c [ getSliceFromMarkdown ]-96', 'font-size:13px; background:pink; color:#bf2c9f;', {
    html,
    slice,
    markdownText,
    processedMarkdown,
  });
  return slice;
};
