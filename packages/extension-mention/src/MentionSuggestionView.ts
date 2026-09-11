import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { PluginView } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { MentionItem, MentionSuggestionRenderProps } from './types';
import {
  getClientRect,
  runMentionCommand,
  type MentionPluginContext,
  type MentionPluginMeta,
  type MentionPluginState,
  type NormalizedSuggestion,
} from './utils';

export class MentionSuggestionView<Item extends MentionItem> implements PluginView {
  private readonly suggestions: NormalizedSuggestion<Item>[];

  private readonly pluginKey: MentionPluginContext<Item>['pluginKey'];

  private readonly writeFlow: MentionPluginContext<Item>['writeFlow'];

  private element?: HTMLDivElement;

  private root?: Root;

  private requestKey = '';

  private abortController?: AbortController;

  private destroyed = false;

  constructor(options: MentionPluginContext<Item>) {
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

    const handled = runMentionCommand({
      view,
      writeFlow: this.writeFlow,
      suggestion,
      state,
      item,
    });

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
