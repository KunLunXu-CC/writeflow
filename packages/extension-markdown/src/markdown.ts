import MarkdownIt from 'markdown-it';
import { tasklist } from '@mdit/plugin-tasklist';

export interface MarkdownToken {
  type: string;
  tag: string;
  nesting: number;
  content: string;
  markup: string;
  info: string;
  attrs: [string, string][] | null;
  children: MarkdownToken[] | null;
}

const markdownIt = new MarkdownIt().use(tasklist, {
  containerClass: 'task-list',
});

/**
 * 预处理 Markdown 文本。
 * 任务列表项必须以 "- [ ]"、"- [x]" 等标准列表形式出现，这里兼容历史数据里的裸 "[ ]" / "[x]" 行。
 */
export const preprocessMarkdown = (markdown: string): string => {
  return markdown.replace(/^([ \t]*?)(\[ \]|\[x\]|\[X\])/gm, '$1- $2');
};

export const renderMarkdownToHtml = (markdownText: string) => {
  return markdownIt.render(preprocessMarkdown(markdownText));
};

export const parseMarkdownTokens = (markdownText: string): MarkdownToken[] => {
  return markdownIt.parse(preprocessMarkdown(markdownText), {}) as MarkdownToken[];
};

export const getTokenAttr = (token: MarkdownToken, name: string) => {
  return token.attrs?.find(([key]) => key === name)?.[1] ?? null;
};

export const hasTokenClass = (token: MarkdownToken, className: string) => {
  const classes = getTokenAttr(token, 'class');

  return classes?.split(/\s+/).includes(className) ?? false;
};
