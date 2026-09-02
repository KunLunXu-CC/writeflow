import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Plugin, PluginKey, type EditorState, type PluginView } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { createPluginKey, type WriteFlow } from '@kunlunxu/wf-core';
import type {
  MentionClientRect,
  MentionCommandContext,
  MentionItem,
  MentionOptions,
  MentionRange,
  MentionSuggestionOptions,
  MentionSuggestionRenderProps,
} from './types';

const DEFAULT_CHAR = '@';
const DEFAULT_ALLOWED_PREFIXES = [' ', '\u00a0'];

type NormalizedSuggestion<Item extends MentionItem> = Omit<
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

interface MentionPluginState<Item extends MentionItem> {
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

type MentionPluginMeta<Item extends MentionItem> =
  | { type: 'exit' }
  | {
      type: 'set-items';
      signature: string;
      items: Item[];
      loading: boolean;
    }
  | { type: 'set-selected-index'; selectedIndex: number };

const createInactiveState = <Item extends MentionItem>(): MentionPluginState<Item> => ({
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

const normalizeSuggestions = <Item extends MentionItem>(
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

const findSuggestion = <Item extends MentionItem>(
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
      const hasAllowedPrefix =
        triggerPosition === 0 || allowedPrefixes === null || allowedPrefixes.includes(prefix);
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

      triggerPosition = textBefore.lastIndexOf(char, triggerPosition - 1);
    }
  });

  return result;
};

const getSignature = (suggestion: ActiveSuggestion) =>
  `${suggestion.suggestionIndex}:${suggestion.range.from}:${suggestion.range.to}:${suggestion.query}`;

const getItemId = <Item extends MentionItem>(item: Item) => String(item.id);

const getItemLabel = <Item extends MentionItem>(item: Item) =>
  item.label === undefined ? getItemId(item) : String(item.label);

const getClientRect = (view: EditorView, position: number): MentionClientRect | null => {
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

class MentionSuggestionView<Item extends MentionItem> implements PluginView {
  private readonly suggestions: NormalizedSuggestion<Item>[];

  private readonly pluginKey: PluginKey<MentionPluginState<Item>>;

  private readonly writeFlow: WriteFlow;

  private element?: HTMLDivElement;

  private root?: Root;

  private requestKey = '';

  private abortController?: AbortController;

  private destroyed = false;

  constructor(options: {
    suggestions: NormalizedSuggestion<Item>[];
    pluginKey: PluginKey<MentionPluginState<Item>>;
    writeFlow: WriteFlow;
  }) {
    this.suggestions = options.suggestions;
    this.pluginKey = options.pluginKey;
    this.writeFlow = options.writeFlow;
  }

  update = (view: EditorView) => {
    if (this.writeFlow.isReadOnly) {
      this.abortRequest();
      this.requestKey = '';
      this.destroyPopup();
      return;
    }

    const state = this.pluginKey.getState(view.state);

    if (!state?.active) {
      this.abortRequest();
      this.requestKey = '';
      this.destroyPopup();
      return;
    }

    const suggestion = this.suggestions[state.suggestionIndex];

    if (!suggestion) {
      this.destroyPopup();
      return;
    }

    if (this.requestKey !== state.signature) {
      this.requestItems(view, state, suggestion);
    }

    this.renderPopup(view, state, suggestion);
  };

  destroy = () => {
    this.destroyed = true;
    this.abortRequest();
    this.destroyPopup();
  };

  private requestItems = (
    view: EditorView,
    state: MentionPluginState<Item>,
    suggestion: NormalizedSuggestion<Item>,
  ) => {
    this.requestKey = state.signature;
    this.abortRequest();

    const controller = new AbortController();
    this.abortController = controller;
    const minQueryLength = suggestion.minQueryLength ?? 0;

    if (state.query.length < minQueryLength) {
      this.dispatchMeta(view, {
        type: 'set-items',
        signature: state.signature,
        items: [],
        loading: false,
      });
      return;
    }

    const items =
      typeof suggestion.items === 'function'
        ? suggestion.items({
            query: state.query,
            char: suggestion.char,
            writeFlow: this.writeFlow,
            signal: controller.signal,
          })
        : suggestion.items || [];

    this.dispatchMeta(view, {
      type: 'set-items',
      signature: state.signature,
      items: [],
      loading: true,
    });

    Promise.resolve(items).then(
      (resolvedItems) => {
        if (this.destroyed || controller.signal.aborted || this.requestKey !== state.signature) {
          return;
        }

        const currentState = this.pluginKey.getState(view.state);

        if (!currentState?.active || currentState.signature !== state.signature) {
          return;
        }

        this.dispatchMeta(view, {
          type: 'set-items',
          signature: state.signature,
          items: resolvedItems,
          loading: false,
        });
      },
      () => {
        if (this.destroyed || controller.signal.aborted || this.requestKey !== state.signature) {
          return;
        }

        this.dispatchMeta(view, {
          type: 'set-items',
          signature: state.signature,
          items: [],
          loading: false,
        });
      },
    );
  };

  private dispatchMeta = (view: EditorView, meta: MentionPluginMeta<Item>) => {
    view.dispatch(view.state.tr.setMeta(this.pluginKey, meta));
  };

  private renderPopup = (
    view: EditorView,
    state: MentionPluginState<Item>,
    suggestion: NormalizedSuggestion<Item>,
  ) => {
    const Component = suggestion.render;

    if (!Component) {
      this.destroyPopup();
      return;
    }

    this.ensurePopup(suggestion.container);
    this.syncTheme(view);
    this.positionPopup(view, state);

    const props: MentionSuggestionRenderProps<Item> = {
      items: state.items,
      selectedIndex: state.selectedIndex,
      query: state.query,
      char: suggestion.char,
      loading: state.loading,
      range: state.range,
      clientRect: () => getClientRect(view, state.range.to),
      select: (item) => this.selectItem(view, item),
    };

    this.root?.render(createElement(Component, props));
  };

  private ensurePopup = (container?: HTMLElement | string) => {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'wf-mention-suggestion';
      this.element.dataset.wfMentionSuggestion = 'true';
      this.root = createRoot(this.element);
    }

    const target =
      typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;
    const parent = target || document.body;

    if (this.element.parentElement !== parent) {
      parent.appendChild(this.element);
    }
  };

  private positionPopup = (view: EditorView, state: MentionPluginState<Item>) => {
    if (!this.element) {
      return;
    }

    const rect = getClientRect(view, state.range.to);

    if (!rect) {
      return;
    }

    Object.assign(this.element.style, {
      left: `${rect.left}px`,
      top: `${rect.bottom + 4}px`,
    });
  };

  private syncTheme = (view: EditorView) => {
    if (!this.element) {
      return;
    }

    const isDark = view.dom.classList.contains('wf-dark');
    this.element.classList.toggle('wf-dark', isDark);
    this.element.classList.toggle('wf-light', !isDark);
  };

  private selectItem = (view: EditorView, item: Item) => {
    const state = this.pluginKey.getState(view.state);

    if (!state?.active) {
      return false;
    }

    const suggestion = this.suggestions[state.suggestionIndex];

    if (!suggestion) {
      return false;
    }

    const context: MentionCommandContext<Item> = {
      item,
      id: getItemId(item),
      label: getItemLabel(item),
      char: suggestion.char,
      range: state.range,
      query: state.query,
      writeFlow: this.writeFlow,
    };
    const handled = suggestion.command
      ? suggestion.command(context)
      : defaultCommand(view, this.writeFlow, context);

    if (handled) {
      this.dispatchMeta(view, { type: 'exit' });
    }

    return handled;
  };

  private abortRequest = () => {
    this.abortController?.abort();
    this.abortController = undefined;
  };

  private destroyPopup = () => {
    this.root?.unmount();
    this.root = undefined;
    this.element?.remove();
    this.element = undefined;
  };
}

const createPlugin = <Item extends MentionItem>(options: {
  suggestions: NormalizedSuggestion<Item>[];
  writeFlow: WriteFlow;
  pluginKey: PluginKey<MentionPluginState<Item>>;
}) => {
  const { suggestions, writeFlow, pluginKey } = options;

  return new Plugin<MentionPluginState<Item>>({
    key: pluginKey,
    state: {
      init: (_config, state) => {
        const activeSuggestion = findSuggestion(state, suggestions, writeFlow.isReadOnly);

        if (!activeSuggestion) {
          return createInactiveState();
        }

        return {
          ...createInactiveState<Item>(),
          active: true,
          suggestionIndex: activeSuggestion.suggestionIndex,
          range: activeSuggestion.range,
          query: activeSuggestion.query,
          text: activeSuggestion.text,
          signature: getSignature(activeSuggestion),
        };
      },
      apply: (transaction, previous, _oldState, newState) => {
        const meta = transaction.getMeta(pluginKey) as MentionPluginMeta<Item> | undefined;

        if (meta?.type === 'exit') {
          return createInactiveState();
        }

        if (meta?.type === 'set-selected-index') {
          return previous.active ? { ...previous, selectedIndex: meta.selectedIndex } : previous;
        }

        if (meta?.type === 'set-items') {
          return previous.active && previous.signature === meta.signature
            ? { ...previous, items: meta.items, loading: meta.loading }
            : previous;
        }

        const activeSuggestion = findSuggestion(newState, suggestions, writeFlow.isReadOnly);

        if (!activeSuggestion) {
          return createInactiveState();
        }

        const signature = getSignature(activeSuggestion);
        const isSameSuggestion = previous.active && previous.signature === signature;

        return {
          ...createInactiveState<Item>(),
          active: true,
          suggestionIndex: activeSuggestion.suggestionIndex,
          range: activeSuggestion.range,
          query: activeSuggestion.query,
          text: activeSuggestion.text,
          items: isSameSuggestion ? previous.items : [],
          selectedIndex: isSameSuggestion ? previous.selectedIndex : 0,
          loading: isSameSuggestion ? previous.loading : false,
          signature,
        };
      },
    },
    props: {
      handleKeyDown(view, event) {
        if (writeFlow.isReadOnly) {
          return false;
        }

        const state = pluginKey.getState(view.state);

        if (!state?.active) {
          return false;
        }

        if (event.key === 'Escape') {
          view.dispatch(view.state.tr.setMeta(pluginKey, { type: 'exit' }));
          return true;
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          if (state.items.length === 0) {
            return false;
          }

          const direction = event.key === 'ArrowUp' ? -1 : 1;
          const selectedIndex =
            (state.selectedIndex + direction + state.items.length) % state.items.length;

          view.dispatch(
            view.state.tr.setMeta(pluginKey, {
              type: 'set-selected-index',
              selectedIndex,
            }),
          );
          return true;
        }

        if (event.key !== 'Enter' && event.key !== 'Tab') {
          return false;
        }

        const item = state.items[state.selectedIndex];

        if (!item) {
          return false;
        }

        const suggestionView = pluginKey.getState(view.state);
        const suggestion = suggestionView ? suggestions[suggestionView.suggestionIndex] : undefined;

        if (!suggestion) {
          return false;
        }

        const context: MentionCommandContext<Item> = {
          item,
          id: getItemId(item),
          label: getItemLabel(item),
          char: suggestion.char,
          range: state.range,
          query: state.query,
          writeFlow,
        };
        const handled = suggestion.command
          ? suggestion.command(context)
          : defaultCommand(view, writeFlow, context);

        if (handled) {
          view.dispatch(view.state.tr.setMeta(pluginKey, { type: 'exit' }));
        }

        return handled;
      },
    },
    view: () => new MentionSuggestionView({ suggestions, pluginKey, writeFlow }),
  });
};

export const buildMentionPlugin = <Item extends MentionItem>(options: {
  mentionOptions: MentionOptions<Item>;
  writeFlow: WriteFlow;
}) => {
  const suggestions = normalizeSuggestions(options.mentionOptions);
  const configuredKey = options.mentionOptions.pluginKey;
  const pluginKey = createPluginKey(
    configuredKey || `wf-mention-${Math.random().toString(36).slice(2)}`,
  ) as PluginKey<MentionPluginState<Item>>;

  return createPlugin({ suggestions, writeFlow: options.writeFlow, pluginKey });
};

export type { MentionPluginState };
