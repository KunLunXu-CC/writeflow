import type { WriteFlowValue } from '@kunlunxu/wf-core';
import {
  getTokenAttr,
  hasTokenClass,
  parseMarkdownTokens,
} from './markdown';
import type { MarkdownToken } from './markdown';

export interface MarkdownToWriteFlowValueOptions {
  markdownText: string;
}

export interface MarkdownToWriteFlowJSONOptions extends MarkdownToWriteFlowValueOptions {
  space?: number;
}

interface ParseBlockOptions {
  stripTaskCheckboxFromNextInline?: boolean;
}

interface InlineParseOptions {
  stripTaskCheckbox?: boolean;
  forceInlineImageText?: boolean;
}

interface ActiveMark {
  name: string;
  mark: WriteFlowValue;
}

const SKIPPED_INLINE_TOKEN_TYPES = new Set([
  'checkbox_input',
  'label_open',
  'label_close',
]);

const getHeadingLevel = (token: MarkdownToken) => {
  const level = Number(token.tag.replace(/^h/i, ''));

  return Number.isInteger(level) && level >= 1 && level <= 6 ? level : 1;
};

const getFenceLanguage = (info: string) => info.trim().split(/\s+/)[0] || null;

const withContent = (node: WriteFlowValue, content: WriteFlowValue[]) => {
  if (content.length === 0) {
    return node;
  }

  return {
    ...node,
    content,
  };
};

const textNode = (text: string, marks: WriteFlowValue[] = []): WriteFlowValue | null => {
  if (!text) {
    return null;
  }

  return marks.length > 0
    ? {
        type: 'text',
        text,
        marks,
      }
    : {
        type: 'text',
        text,
      };
};

class MarkdownWriteFlowParser {
  private index = 0;

  constructor(private readonly tokens: MarkdownToken[]) {}

  public parseDoc(): WriteFlowValue {
    return {
      type: 'doc',
      content: this.ensureBlockContent(this.parseBlocks()),
    };
  }

  private parseBlocks(stopTypes = new Set<string>(), options: ParseBlockOptions = {}) {
    const blocks: WriteFlowValue[] = [];

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];

      if (stopTypes.has(token.type)) {
        this.index += 1;
        break;
      }

      switch (token.type) {
        case 'paragraph_open':
          blocks.push(...this.parseParagraph(options));
          break;
        case 'heading_open':
          blocks.push(this.parseHeading(token));
          break;
        case 'blockquote_open':
          blocks.push(this.parseBlockquote());
          break;
        case 'bullet_list_open':
        case 'ordered_list_open':
          blocks.push(this.parseList(token));
          break;
        case 'fence':
        case 'code_block':
          blocks.push(this.parseCodeBlock(token));
          this.index += 1;
          break;
        case 'hr':
          blocks.push({ type: 'horizontal_rule' });
          this.index += 1;
          break;
        case 'table_open':
          blocks.push(this.parseTable());
          break;
        case 'inline':
          blocks.push(...this.createBlocksFromInline(token.children ?? []));
          this.index += 1;
          break;
        default:
          this.index += 1;
          break;
      }
    }

    return blocks;
  }

  private parseParagraph(options: ParseBlockOptions) {
    this.index += 1;

    const inlineToken = this.tokens[this.index];
    const stripTaskCheckbox = Boolean(options.stripTaskCheckboxFromNextInline);
    options.stripTaskCheckboxFromNextInline = false;

    if (inlineToken?.type === 'inline') {
      this.index += 1;
      this.consume('paragraph_close');

      return this.createBlocksFromInline(inlineToken.children ?? [], {
        stripTaskCheckbox,
      });
    }

    this.consume('paragraph_close');

    return [this.createParagraph([])];
  }

  private parseHeading(token: MarkdownToken) {
    this.index += 1;

    const inlineToken = this.tokens[this.index];
    const content =
      inlineToken?.type === 'inline'
        ? this.createInlineNodes(inlineToken.children ?? [], {
            forceInlineImageText: true,
          })
        : [];

    if (inlineToken?.type === 'inline') {
      this.index += 1;
    }

    this.consume('heading_close');

    return withContent(
      {
        type: 'heading',
        attrs: {
          level: getHeadingLevel(token),
        },
      },
      content,
    );
  }

  private parseBlockquote() {
    this.index += 1;

    return {
      type: 'blockquote',
      content: this.ensureBlockContent(this.parseBlocks(new Set(['blockquote_close']))),
    };
  }

  private parseList(token: MarkdownToken) {
    const isOrdered = token.type === 'ordered_list_open';
    const isTaskList = !isOrdered && hasTokenClass(token, 'task-list');
    const closeType = isOrdered ? 'ordered_list_close' : 'bullet_list_close';
    const items: WriteFlowValue[] = [];

    this.index += 1;

    while (this.index < this.tokens.length) {
      const current = this.tokens[this.index];

      if (current.type === closeType) {
        this.index += 1;
        break;
      }

      if (current.type === 'list_item_open') {
        items.push(this.parseListItem(isTaskList));
        continue;
      }

      this.index += 1;
    }

    if (isTaskList) {
      return {
        type: 'task_list',
        content: items,
      };
    }

    if (isOrdered) {
      return {
        type: 'ordered_list',
        attrs: {
          order: Number(getTokenAttr(token, 'start')) || 1,
        },
        content: items,
      };
    }

    return {
      type: 'bullet_list',
      content: items,
    };
  }

  private parseListItem(isTaskItem: boolean) {
    const checked = isTaskItem ? this.getTaskItemChecked() : false;
    this.index += 1;

    const content = this.ensureBlockContent(
      this.parseBlocks(new Set(['list_item_close']), {
        stripTaskCheckboxFromNextInline: isTaskItem,
      }),
    );

    if (!isTaskItem) {
      return {
        type: 'list_item',
        content,
      };
    }

    return {
      type: 'task_item',
      attrs: {
        checked,
      },
      content,
    };
  }

  private getTaskItemChecked() {
    for (let i = this.index + 1; i < this.tokens.length; i += 1) {
      const token = this.tokens[i];

      if (token.type === 'list_item_close') {
        return false;
      }

      const checkbox = token.children?.find((child) => child.type === 'checkbox_input');

      if (checkbox) {
        return getTokenAttr(checkbox, 'checked') === 'checked';
      }
    }

    return false;
  }

  private parseCodeBlock(token: MarkdownToken) {
    return withContent(
      {
        type: 'code_block',
        attrs: {
          language: getFenceLanguage(token.info),
        },
      },
      token.content
        ? [
            {
              type: 'text',
              text: token.content,
            },
          ]
        : [],
    );
  }

  private parseTable() {
    const rows: WriteFlowValue[] = [];

    this.index += 1;

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];

      if (token.type === 'table_close') {
        this.index += 1;
        break;
      }

      if (token.type === 'tr_open') {
        rows.push(this.parseTableRow());
        continue;
      }

      this.index += 1;
    }

    return {
      type: 'table',
      content: rows,
    };
  }

  private parseTableRow() {
    const cells: WriteFlowValue[] = [];

    this.index += 1;

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];

      if (token.type === 'tr_close') {
        this.index += 1;
        break;
      }

      if (token.type === 'th_open' || token.type === 'td_open') {
        cells.push(this.parseTableCell(token.type === 'th_open'));
        continue;
      }

      this.index += 1;
    }

    return {
      type: 'table_row',
      content: cells,
    };
  }

  private parseTableCell(isHeader: boolean) {
    const closeType = isHeader ? 'th_close' : 'td_close';
    const content: WriteFlowValue[] = [];

    this.index += 1;

    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];

      if (token.type === closeType) {
        this.index += 1;
        break;
      }

      if (token.type === 'inline') {
        content.push(
          ...this.createBlocksFromInline(token.children ?? [], {
            forceInlineImageText: true,
          }),
        );
        this.index += 1;
        continue;
      }

      this.index += 1;
    }

    return {
      type: isHeader ? 'table_header' : 'table_cell',
      content: this.ensureBlockContent(content),
    };
  }

  private createBlocksFromInline(children: MarkdownToken[], options: InlineParseOptions = {}) {
    if (this.isImageOnlyInline(children) && !options.forceInlineImageText) {
      return children
        .filter((child) => child.type === 'image')
        .map((child) => this.createImage(child));
    }

    return [
      this.createParagraph(
        this.createInlineNodes(children, {
          ...options,
          forceInlineImageText: true,
        }),
      ),
    ];
  }

  private createInlineNodes(children: MarkdownToken[], options: InlineParseOptions = {}) {
    const content: WriteFlowValue[] = [];
    const activeMarks: ActiveMark[] = [];
    let taskWhitespaceStripped = false;

    const pushText = (text: string, marks?: WriteFlowValue[]) => {
      const node = textNode(text, marks ?? activeMarks.map(({ mark }) => mark));

      if (node) {
        content.push(node);
      }
    };

    const pushMark = (name: string, attrs?: Record<string, unknown>) => {
      activeMarks.push({
        name,
        mark:
          attrs === undefined
            ? {
                type: name,
              }
            : {
                type: name,
                attrs,
              },
      });
    };

    const popMark = (name: string) => {
      const index = activeMarks.findLastIndex((item) => item.name === name);

      if (index >= 0) {
        activeMarks.splice(index, 1);
      }
    };

    children.forEach((child) => {
      if (SKIPPED_INLINE_TOKEN_TYPES.has(child.type)) {
        return;
      }

      switch (child.type) {
        case 'text':
        case 'text_special':
        case 'html_inline': {
          const text =
            options.stripTaskCheckbox && !taskWhitespaceStripped
              ? child.content.replace(/^\s+/, '')
              : child.content;

          taskWhitespaceStripped = true;
          pushText(text);
          break;
        }
        case 'code_inline':
          pushText(child.content, [
            ...activeMarks.map(({ mark }) => mark),
            {
              type: 'inline_code',
            },
          ]);
          break;
        case 'link_open':
          pushMark('link', {
            href: getTokenAttr(child, 'href') || '',
            title: getTokenAttr(child, 'title'),
          });
          break;
        case 'link_close':
          popMark('link');
          break;
        case 'strong_open':
        case 'strong_close':
        case 'em_open':
        case 'em_close':
          break;
        case 'hardbreak':
          content.push({ type: 'hard_break' });
          break;
        case 'softbreak':
          pushText('\n');
          break;
        case 'image':
          pushText(child.content || getTokenAttr(child, 'alt') || '');
          break;
        default:
          if (child.content) {
            pushText(child.content);
          }
          break;
      }
    });

    return content;
  }

  private createImage(token: MarkdownToken) {
    return {
      type: 'image',
      attrs: {
        src: getTokenAttr(token, 'src'),
        alt: token.content || getTokenAttr(token, 'alt'),
        title: getTokenAttr(token, 'title'),
      },
    };
  }

  private createParagraph(content: WriteFlowValue[]) {
    return withContent({ type: 'paragraph' }, content);
  }

  private ensureBlockContent(content: WriteFlowValue[]) {
    return content.length > 0 ? content : [this.createParagraph([])];
  }

  private consume(type: string) {
    if (this.tokens[this.index]?.type === type) {
      this.index += 1;
    }
  }

  private isImageOnlyInline(children: MarkdownToken[]) {
    const meaningfulChildren = children.filter((child) => {
      if (SKIPPED_INLINE_TOKEN_TYPES.has(child.type)) {
        return false;
      }

      return child.type !== 'text' || child.content.trim().length > 0;
    });

    return (
      meaningfulChildren.length > 0 &&
      meaningfulChildren.every((child) => child.type === 'image')
    );
  }
}

export const markdownToWriteFlowValue = (
  options: MarkdownToWriteFlowValueOptions,
): WriteFlowValue => {
  const tokens = parseMarkdownTokens(options.markdownText);

  return new MarkdownWriteFlowParser(tokens).parseDoc();
};

export const markdownToWriteFlowJSON = (options: MarkdownToWriteFlowJSONOptions) => {
  const { space, ...restOptions } = options;

  return JSON.stringify(markdownToWriteFlowValue(restOptions), null, space);
};
