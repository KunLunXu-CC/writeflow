import type { WriteFlow } from '@kunlunxu/wf-core';
import type { EditorState, PluginKey } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type {
  MentionClientRect,
  MentionCommandContext,
  MentionItem,
  MentionOptions,
  MentionRange,
  MentionSuggestionOptions,
} from './types';

const DEFAULT_CHAR = '@';
const DEFAULT_ALLOWED_PREFIXES = [' ', '\u00a0'];

export type NormalizedSuggestion<Item extends MentionItem> = Omit<
  MentionSuggestionOptions<Item>,
  'char' | 'allowedPrefixes'
> & {
  char: string;
  allowedPrefixes: string[] | null;
};

interface ActiveSuggestion {
  suggestionIndex: number;
  range: MentionRange;
  query: string;
  text: string;
}

export interface MentionPluginState<Item extends MentionItem> {
  active: boolean;
  suggestionIndex: number;
  range: MentionRange;
  query: string;
  text: string;
  items: Item[];
  selectedIndex: number;
  loading: boolean;
  signature: string;
}

export type MentionPluginMeta<Item extends MentionItem> =
  | { type: 'exit' }
  | {
      type: 'set-items';
      signature: string;
      items: Item[];
      loading: boolean;
    }
  | { type: 'set-selected-index'; selectedIndex: number };

export interface MentionPluginContext<Item extends MentionItem> {
  suggestions: NormalizedSuggestion<Item>[];
  pluginKey: PluginKey<MentionPluginState<Item>>;
  writeFlow: WriteFlow;
}

export const createInactiveState = <Item extends MentionItem>(): MentionPluginState<Item> => ({
  active: false,
  suggestionIndex: -1,
  range: { from: 0, to: 0 },
  query: '',
  text: '',
  items: [],
  selectedIndex: 0,
  loading: false,
  signature: '',
});

export const normalizeSuggestions = <Item extends MentionItem>(
  options: MentionOptions<Item>,
): NormalizedSuggestion<Item>[] => {
  const suggestions = options.suggestions?.length
    ? options.suggestions
    : options.suggestion
      ? [options.suggestion]
      : [{ items: [] }];

  return suggestions.map((suggestion) => ({
    ...suggestion,
    char: suggestion.char || DEFAULT_CHAR,
    allowedPrefixes: suggestion.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES,
  }));
};

export const findSuggestion = <Item extends MentionItem>(
  state: EditorState,
  suggestions: NormalizedSuggestion<Item>[],
  readOnly: boolean,
): ActiveSuggestion | null => {
  if (readOnly || !state.selection.empty || !state.selection.$from.parent.isTextblock) {
    return null;
  }

  const { $from } = state.selection;
  const textBefore = $from.parent.textBetween(0, $from.parentOffset, '\n', '\0');
  const parentStart = $from.start();
  let result: (ActiveSuggestion & { triggerPosition: number }) | null = null;

  suggestions.forEach((suggestion, suggestionIndex) => {
    const { char, allowSpaces = false, allowToIncludeChar = false, allowedPrefixes } = suggestion;

    if (!char) {
      return;
    }

    let triggerPosition = textBefore.lastIndexOf(char);

    while (triggerPosition >= 0) {
      const prefix = textBefore[triggerPosition - 1];
      const triggerPos = parentStart + triggerPosition;
      const isAfterMention =
        state.doc.resolve(triggerPos).nodeBefore?.type === state.schema.nodes.mention;
      const hasAllowedPrefix =
        triggerPosition === 0 ||
        isAfterMention ||
        allowedPrefixes === null ||
        allowedPrefixes.includes(prefix);
      const query = textBefore.slice(triggerPosition + char.length);
      const hasInvalidSpace = !allowSpaces && /\s/.test(query);
      const hasInvalidChar = !allowToIncludeChar && query.includes(char);

      if (hasAllowedPrefix && !hasInvalidSpace && !hasInvalidChar) {
        const candidate = {
          suggestionIndex,
          range: {
            from: parentStart + triggerPosition,
            to: $from.pos,
          },
          query,
          text: textBefore.slice(triggerPosition),
          triggerPosition,
        };

        if (!result || candidate.triggerPosition > result.triggerPosition) {
          result = candidate;
        }
        break;
      }

      triggerPosition =
        triggerPosition > 0 ? textBefore.lastIndexOf(char, triggerPosition - 1) : -1;
    }
  });

  return result;
};

export const getSignature = (suggestion: ActiveSuggestion) =>
  `${suggestion.suggestionIndex}:${suggestion.range.from}:${suggestion.range.to}:${suggestion.query}`;

export const getClientRect = (view: EditorView, position: number): MentionClientRect | null => {
  try {
    const rect = view.coordsAtPos(position);
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    };
  } catch {
    return null;
  }
};

const defaultCommand = <Item extends MentionItem>(
  view: EditorView,
  writeFlow: WriteFlow,
  context: MentionCommandContext<Item>,
) => {
  if (writeFlow.isReadOnly) {
    return false;
  }

  const mentionType = view.state.schema.nodes.mention;

  if (!mentionType) {
    return false;
  }

  const mentionNode = mentionType.create({
    id: context.id,
    label: context.label,
    char: context.char,
  });
  const transaction = view.state.tr.replaceWith(context.range.from, context.range.to, mentionNode);

  transaction.insertText(' ', context.range.from + mentionNode.nodeSize);
  view.dispatch(transaction);

  return true;
};

export const runMentionCommand = <Item extends MentionItem>(options: {
  view: EditorView;
  writeFlow: WriteFlow;
  suggestion: NormalizedSuggestion<Item>;
  state: MentionPluginState<Item>;
  item: Item;
}) => {
  const { view, writeFlow, suggestion, state, item } = options;
  const id = String(item.id);
  const context: MentionCommandContext<Item> = {
    item,
    id,
    label: item.label === undefined ? id : String(item.label),
    char: suggestion.char,
    range: state.range,
    query: state.query,
    writeFlow,
  };

  return suggestion.command
    ? suggestion.command(context)
    : defaultCommand(view, writeFlow, context);
};
