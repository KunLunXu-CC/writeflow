import { Node } from '@kunlunxu/wf-core';
import type { NodeSpec } from 'prosemirror-model';
import { buildMentionPlugin } from './buildMentionPlugin';
import type { MentionItem, MentionOptions } from './types';
import './index.scss';

const createMention = <Item extends MentionItem = MentionItem>(
  options: MentionOptions<Item> = {},
) => {
  const suggestions = options.suggestions?.length
    ? options.suggestions
    : options.suggestion
      ? [options.suggestion]
      : [{ char: '@', items: [] }];

  return Node.create<MentionOptions<Item>>({
    name: 'mention',

    options: {
      HTMLAttributes: {},
      ...options,
      suggestions,
    },

    addSchema: ({ extension }): NodeSpec => {
      const mentionOptions = extension.options as MentionOptions<Item>;

      return {
        inline: true,
        group: 'inline',
        atom: true,
        selectable: false,
        attrs: {
          id: {
            default: '',
            validate: 'string',
          },
          label: {
            default: null,
            validate: 'string|null',
          },
          char: {
            default: '@',
            validate: 'string',
          },
        },
        toDOM: (node) => {
          const id = String(node.attrs.id);
          const label = node.attrs.label === null ? id : String(node.attrs.label);
          const char = String(node.attrs.char || '@');
          const customText = mentionOptions.renderText?.({ node, char });
          const htmlAttributes = mentionOptions.HTMLAttributes || {};
          const className = [htmlAttributes.class, 'wf-mention'].filter(Boolean).join(' ');

          return [
            'span',
            {
              ...htmlAttributes,
              class: className,
              'data-type': 'mention',
              'data-id': id,
              'data-label': label,
              'data-char': char,
            },
            customText ?? `${char}${label}`,
          ];
        },
        parseDOM: [
          {
            tag: 'span[data-type="mention"]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              return {
                id: element.dataset.id || '',
                label: element.dataset.label || element.textContent?.slice(1) || '',
                char: element.dataset.char || '@',
              };
            },
          },
        ],
      };
    },

    addPlugins: ({ writeFlow, extension }) => [
      buildMentionPlugin({
        mentionOptions: extension.options as MentionOptions<Item>,
        writeFlow,
      }),
    ],
  });
};

export const Mention = createMention();

export { createMention, buildMentionPlugin };
export * from './types';
