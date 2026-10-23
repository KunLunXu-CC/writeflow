import { createPluginKey, type WriteFlow } from '@kunlunxu/wf-core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { MentionSuggestionView } from './MentionSuggestionView';
import {
  createInactiveState,
  findSuggestion,
  getSignature,
  normalizeSuggestions,
  runMentionCommand,
  type MentionPluginMeta,
  type MentionPluginState,
} from './utils';
import type { MentionItem, MentionOptions } from './types';

export const buildMentionPlugin = <Item extends MentionItem>(options: {
  mentionOptions: MentionOptions<Item>;
  writeFlow: WriteFlow;
}) => {
  const { mentionOptions, writeFlow } = options;
  const suggestions = normalizeSuggestions(mentionOptions);
  const pluginKey = createPluginKey(
    mentionOptions.pluginKey || `wf-mention-${Math.random().toString(36).slice(2)}`,
  ) as PluginKey<MentionPluginState<Item>>;

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
      handleDOMEvents: {
        keydown(view, rawEvent) {
          const event = rawEvent as KeyboardEvent;

          if (writeFlow.isReadOnly || event.isComposing || view.composing) {
            return false;
          }

          const state = pluginKey.getState(view.state);

          if (!state?.active) {
            return false;
          }

          if (event.key === 'Escape') {
            event.preventDefault();
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

            event.preventDefault();
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
          const suggestion = suggestions[state.suggestionIndex];

          if (!item || !suggestion) {
            return false;
          }

          const handled = runMentionCommand({ view, writeFlow, suggestion, state, item });

          if (handled) {
            event.preventDefault();
            view.dispatch(view.state.tr.setMeta(pluginKey, { type: 'exit' }));
          }

          return handled;
        },
      },
    },
    view: () => new MentionSuggestionView({ suggestions, pluginKey, writeFlow }),
  });
};

export type { MentionPluginState } from './utils';
