// 参考: https://prosemirror.net/examples/codemirror/
import {
  defaultHighlightStyle,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language';
import { Selection, TextSelection } from 'prosemirror-state';
import {
  ViewUpdate,
  drawSelection,
  EditorView as CodeMirrorView,
} from '@codemirror/view';
import { Text } from '@codemirror/state';
import { Node } from 'prosemirror-model';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { Extension } from '@codemirror/state';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { EditorView, NodeView, NodeViewConstructor } from 'prosemirror-view';

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
  forwardUpdate(update: ViewUpdate): void;
  maybeEscape(unit: string, dir: number): boolean;
  setSelection(anchor: number, head: number): void;
}

// 语言支持映射
const LANGUAGE_MAP: { [key: string]: () => Extension } = {
  // '正则': 语言
  '^css': css,
  '^html': html,
  '^json': json,
  '^diff': () => StreamLanguage.define(diff),
  '^(shell|sh|bash)': () => StreamLanguage.define(shell),
  '^(javascript|js|typescript|ts)': () => javascript({ typescript: true }),
  '^(jsx|tsx)': () => javascript({ jsx: true, typescript: true }),
};

// 获取语言扩展
const getLanguageExtension = (language: string) => {
  if (!language) {
    return syntaxHighlighting(defaultHighlightStyle);
  }

  for (const key in LANGUAGE_MAP) {
    if (new RegExp(key, 'i').test(language)) {
      return LANGUAGE_MAP[key]();
    }
  }

  return syntaxHighlighting(defaultHighlightStyle);
};

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
        CodeMirrorView.updateListener.of((update) =>
          this.forwardUpdate(update),
        ),
      ],
    });

    this.updating = false; // 状态值: 用于避免外层和内层编辑器之间的更新循环
    this.dom = this.createDom(); // 节点的 DOM 节点设置为 CodeMirror 的 DOM 节点
  }

  createDom(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'writerflow-code-block';

    const header = document.createElement('div');
    header.className = 'writerflow-code-block-header';
    header.innerHTML = `<div class="writerflow-code-block-point"/>`;

    wrap.appendChild(header);
    wrap.appendChild(this.cm.dom);
    return wrap;
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

export const codeBlockNodeView: NodeViewConstructor = (
  node: Node,
  view: EditorView,
  getPos: () => number | undefined,
) => new CodeBlockViewImpl(node, view, getPos);
