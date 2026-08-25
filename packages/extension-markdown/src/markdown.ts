import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';
import type { Schema } from 'prosemirror-model';
import { tasklist } from '@mdit/plugin-tasklist';

const SKIPPED_IMAGE_CONTEXT_TOKENS = new Set(['checkbox_input', 'label_open', 'label_close']);

const hasTokenClass = (token: Token, className: string) => {
  return token.attrGet('class')?.split(/\s+/).includes(className) ?? false;
};

const getImageAlt = (token: Token) => {
  return (
    token.content ||
    token.attrGet('alt') ||
    token.children?.map((child) => child.content).join('') ||
    ''
  );
};

const isImageOnlyInline = (children: Token[]) => {
  const meaningfulChildren = children.filter((child) => {
    if (SKIPPED_IMAGE_CONTEXT_TOKENS.has(child.type)) {
      return false;
    }

    return child.type !== 'text' || child.content.trim().length > 0;
  });

  return (
    meaningfulChildren.length > 0 && meaningfulChildren.every((child) => child.type === 'image')
  );
};

const normalizeInlineChildren = (
  children: Token[],
  options: {
    keepImages: boolean;
    stripLeadingWhitespace: boolean;
    supportsHardBreak: boolean;
    supportsInlineCode: boolean;
  },
) => {
  let leadingWhitespaceStripped = false;

  children.forEach((child) => {
    if (child.type === 'softbreak') {
      child.type = 'text';
      child.content = '\n';
      return;
    }

    if (child.type === 'hardbreak' && !options.supportsHardBreak) {
      child.type = 'text';
      child.content = '\n';
      return;
    }

    if (child.type === 'code_inline' && !options.supportsInlineCode) {
      child.type = 'text';
      return;
    }

    if (child.type === 'html_inline' || child.type === 'text_special') {
      child.type = 'text';
    }

    if (child.type === 'image' && !options.keepImages) {
      child.type = 'text';
      child.content = getImageAlt(child);
    }

    if (
      options.stripLeadingWhitespace &&
      !leadingWhitespaceStripped &&
      (child.type === 'text' || child.type === 'text_special')
    ) {
      child.content = child.content.replace(/^\s+/, '');
      leadingWhitespaceStripped = true;
    }
  });
};

/**
 * 将 markdown-it 的通用 Token 调整为 WriteFlow 节点命名和内容约束。
 */
const normalizeWriteFlowTokens = (markdown: MarkdownIt, schema: Schema) => {
  markdown.core.ruler.after('task_list', 'writeflow_tokens', (state) => {
    const bulletListStack: boolean[] = [];
    const listItemStack: boolean[] = [];
    const supportsTaskList = Boolean(schema.nodes.task_list && schema.nodes.task_item);
    const supportsImage = Boolean(schema.nodes.image);
    const supportsHardBreak = Boolean(schema.nodes.hard_break);
    const supportsInlineCode = Boolean(schema.marks.inline_code);
    let listItemDepth = 0;

    state.tokens.forEach((token, index, tokens) => {
      if (token.type === 'bullet_list_open') {
        const isTaskList = supportsTaskList && hasTokenClass(token, 'task-list');
        bulletListStack.push(isTaskList);

        if (isTaskList) {
          token.type = 'task_list_open';
        }
      } else if (token.type === 'bullet_list_close') {
        if (bulletListStack.pop()) {
          token.type = 'task_list_close';
        }
      }

      if (token.type === 'list_item_open') {
        const isTaskItem = hasTokenClass(token, 'task-list-item');
        listItemStack.push(isTaskItem);
        listItemDepth += 1;

        if (isTaskItem && supportsTaskList) {
          const inlineToken = tokens.slice(index + 1).find((item) => item.type === 'inline');
          const checkbox = inlineToken?.children?.find((child) => child.type === 'checkbox_input');

          token.type = 'task_item_open';
          token.attrSet('checked', checkbox?.attrGet('checked') === 'checked' ? 'true' : 'false');
        }
      } else if (token.type === 'list_item_close') {
        if (listItemStack.pop() && supportsTaskList) {
          token.type = 'task_item_close';
        }

        listItemDepth -= 1;
      }

      if (token.type === 'heading_open' && !schema.nodes.heading) {
        token.type = 'paragraph_open';
        token.tag = 'p';
      } else if (token.type === 'heading_close' && !schema.nodes.heading) {
        token.type = 'paragraph_close';
        token.tag = 'p';
      }

      if ((token.type === 'fence' || token.type === 'code_block') && !schema.nodes.code_block) {
        token.type = 'text_block';
      }

      if (token.type !== 'inline' || !token.children) {
        return;
      }

      const paragraphOpen = tokens[index - 1];
      const paragraphClose = tokens[index + 1];
      const canPromoteImages =
        supportsImage &&
        listItemDepth === 0 &&
        paragraphOpen?.type === 'paragraph_open' &&
        paragraphClose?.type === 'paragraph_close' &&
        isImageOnlyInline(token.children);

      if (canPromoteImages) {
        paragraphOpen.type = 'image_paragraph_open';
        paragraphClose.type = 'image_paragraph_close';
      }

      normalizeInlineChildren(token.children, {
        keepImages: canPromoteImages,
        stripLeadingWhitespace: listItemStack.at(-1) === true,
        supportsHardBreak,
        supportsInlineCode,
      });
    });

    for (let index = 0; index < state.tokens.length - 2; index += 1) {
      const openToken = state.tokens[index];
      const inlineToken = state.tokens[index + 1];
      const closeToken = state.tokens[index + 2];
      const isTableCell = openToken.type === 'th_open' || openToken.type === 'td_open';

      if (
        !isTableCell ||
        inlineToken.type !== 'inline' ||
        closeToken.type !== openToken.type.replace('_open', '_close')
      ) {
        continue;
      }

      const paragraphOpen = new state.Token('paragraph_open', 'p', 1);
      const paragraphClose = new state.Token('paragraph_close', 'p', -1);

      state.tokens.splice(index + 1, 0, paragraphOpen);
      state.tokens.splice(index + 3, 0, paragraphClose);
      index += 4;
    }
  });
};

/**
 * 预处理 Markdown 文本。
 * 任务列表项必须以 "- [ ]"、"- [x]" 等标准列表形式出现，这里兼容历史数据里的裸 "[ ]" / "[x]" 行。
 */
export const preprocessMarkdown = (markdown: string): string => {
  return markdown.replace(/^([ \t]*?)(\[ \]|\[x\]|\[X\])/gm, '$1- $2');
};

export const createMarkdownTokenizer = (schema: Schema) => {
  const markdown = new MarkdownIt().use(tasklist, {
    containerClass: 'task-list',
  });

  normalizeWriteFlowTokens(markdown, schema);

  return markdown;
};
