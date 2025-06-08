import {
  defaultHighlightStyle,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language';
import {
  Command,
  Selection,
  EditorState,
  Transaction,
  TextSelection,
} from 'prosemirror-state';
import {
  ViewUpdate,
  drawSelection,
  keymap as cmKeymap,
  EditorView as CodeMirrorView,
} from '@codemirror/view';
import { Text } from '@codemirror/state';
import { Node } from 'prosemirror-model';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { Extension } from '@codemirror/state';
import { exitCode } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { defaultKeymap } from '@codemirror/commands';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { EditorView, NodeView, NodeViewConstructor } from 'prosemirror-view';

// 语言支持映射
const LANGUAGE_MAP: { [key: string]: () => Extension } = {
  css,
  html,
  json,
  javascript,
  js: javascript,
  ts: () => javascript({ typescript: true }),
  typescript: () => javascript({ typescript: true }),
  jsx: () => javascript({ jsx: true }),
  tsx: () => javascript({ jsx: true, typescript: true }),

  diff: () => StreamLanguage.define(diff),
};

// 获取语言扩展
const getLanguageExtension = (language: string) => {
  if (!language) {
    return syntaxHighlighting(defaultHighlightStyle);
  }

  const lang = LANGUAGE_MAP[language.toLowerCase()];
  return lang ? lang() : syntaxHighlighting(defaultHighlightStyle);
};

type KeyBinding = {
  key: string;
  mac?: string;
  run: () => boolean;
};

interface CodeBlockView extends NodeView {
  node: Node;
  view: EditorView;
  dom: HTMLElement;
  updating: boolean;
  cm: CodeMirrorView;
  selectNode(): void;
  stopEvent(): boolean;
  update(node: Node): boolean;
  getPos: () => number | undefined;
  codeMirrorKeymap(): KeyBinding[];
  forwardUpdate(update: ViewUpdate): void;
  maybeEscape(unit: string, dir: number): boolean;
  setSelection(anchor: number, head: number): void;
}

class CodeBlockViewImpl implements CodeBlockView {
  node: Node;
  view: EditorView;
  dom: HTMLElement;
  updating: boolean;
  cm: CodeMirrorView;
  getPos: () => number | undefined;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    // 存储初始值用于后续操作
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    // 获取语言扩展
    const language = node.attrs.language;
    const languageExtension = getLanguageExtension(language);

    // 创建 CodeMirror 实例
    this.cm = new CodeMirrorView({
      doc: this.node.textContent,
      extensions: [
        dracula,
        drawSelection(),
        languageExtension,
        cmKeymap.of([...this.codeMirrorKeymap(), ...defaultKeymap]),
        CodeMirrorView.updateListener.of((update) =>
          this.forwardUpdate(update),
        ),
      ],
    });

    this.dom = this.cm.dom; // 节点的 DOM 节点设置为 CodeMirror 的 DOM 节点
    this.updating = false; // 状态值: 用于避免外层和内层编辑器之间的更新循环
  }

  forwardUpdate(update: ViewUpdate): void {
    if (this.updating || !this.cm.hasFocus) return;
    const pos = this.getPos();
    if (pos === undefined) return;
    let offset = pos + 1;

    const { main } = update.state.selection;
    const selFrom = offset + main.from;
    const selTo = offset + main.to;

    const pmSel = this.view.state.selection;
    if (update.docChanged || pmSel.from !== selFrom || pmSel.to !== selTo) {
      const tr = this.view.state.tr;
      update.changes.iterChanges(
        (
          fromA: number,
          toA: number,
          fromB: number,
          toB: number,
          inserted: Text,
        ) => {
          if (inserted.length)
            tr.replaceWith(
              offset + fromA,
              offset + toA,
              this.view.state.schema.text(inserted.toString()),
            );
          else tr.delete(offset + fromA, offset + toA);
          offset += toB - fromB - (toA - fromA);
        },
      );
      tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo));
      this.view.dispatch(tr);
    }
  }

  setSelection(anchor: number, head: number): void {
    this.cm.focus();
    this.updating = true;
    this.cm.dispatch({ selection: { anchor, head } });
    this.updating = false;
  }

  codeMirrorKeymap(): KeyBinding[] {
    return [
      { key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
      { key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
      { key: 'ArrowDown', run: () => this.maybeEscape('line', 1) },
      { key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
      {
        key: 'Ctrl-Enter',
        run: () => {
          if (!exitCode(this.view.state, this.view.dispatch)) return false;
          this.view.focus();
          return true;
        },
      },
      {
        key: 'Ctrl-z',
        mac: 'Cmd-z',
        run: () => undo(this.view.state, this.view.dispatch),
      },
      {
        key: 'Shift-Ctrl-z',
        mac: 'Shift-Cmd-z',
        run: () => redo(this.view.state, this.view.dispatch),
      },
      {
        key: 'Ctrl-y',
        mac: 'Cmd-y',
        run: () => redo(this.view.state, this.view.dispatch),
      },
    ];
  }

  maybeEscape(unit: string, dir: number): boolean {
    const { state } = this.cm;
    const { main } = state.selection;
    if (!main.empty) return false;
    if (unit == 'line') {
      const line = state.doc.lineAt(main.head);
      if (dir < 0 ? line.from > 0 : line.to < state.doc.length) return false;
    } else {
      if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false;
    }
    const pos = this.getPos();
    if (pos === undefined) return false;
    const targetPos = pos + (dir < 0 ? 0 : this.node.nodeSize);
    const selection = Selection.near(
      this.view.state.doc.resolve(targetPos),
      dir,
    );
    const tr = this.view.state.tr.setSelection(selection).scrollIntoView();

    this.view.dispatch(tr);
    this.view.focus();
    return true;
  }

  update(node: Node): boolean {
    if (node.type != this.node.type) return false;
    this.node = node;
    if (this.updating) return true;
    const newText = node.textContent;
    const curText = this.cm.state.doc.toString();
    if (newText != curText) {
      let start = 0;
      let curEnd = curText.length;
      let newEnd = newText.length;
      while (
        start < curEnd &&
        curText.charCodeAt(start) == newText.charCodeAt(start)
      ) {
        ++start;
      }
      while (
        curEnd > start &&
        newEnd > start &&
        curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)
      ) {
        curEnd--;
        newEnd--;
      }
      this.updating = true;
      this.cm.dispatch({
        changes: {
          from: start,
          to: curEnd,
          insert: newText.slice(start, newEnd),
        },
      });
      this.updating = false;
    }
    return true;
  }

  selectNode(): void {
    this.cm.focus();
  }

  stopEvent(): boolean {
    return true;
  }
}

const arrowHandler = (dir: 'left' | 'right' | 'up' | 'down'): Command => {
  return (
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: EditorView,
  ): boolean => {
    if (state.selection.empty && view?.endOfTextblock(dir)) {
      const side = dir == 'left' || dir == 'up' ? -1 : 1;
      const $head = state.selection.$head;
      const nextPos = Selection.near(
        state.doc.resolve(side > 0 ? $head.after() : $head.before()),
        side,
      );
      if (nextPos.$head && nextPos.$head.parent.type.name == 'code_block') {
        dispatch?.(state.tr.setSelection(nextPos));
        return true;
      }
    }
    return false;
  };
};

export const codeBlockNodeView: NodeViewConstructor = (
  node: Node,
  view: EditorView,
  getPos: () => number | undefined,
) => new CodeBlockViewImpl(node, view, getPos);

export const arrowHandlers: { [key: string]: Command } = {
  ArrowLeft: arrowHandler('left'),
  ArrowRight: arrowHandler('right'),
  ArrowUp: arrowHandler('up'),
  ArrowDown: arrowHandler('down'),
};
