// 参考: https://prosemirror.net/examples/codemirror/

import { Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  ViewUpdate,
  drawSelection,
  keymap as cmKeymap,
  EditorView as CodeMirrorView,
} from '@codemirror/view';
import { Text } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Extension } from '@codemirror/state';
import { exitCode } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { javascript } from '@codemirror/lang-javascript';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { Selection, TextSelection } from 'prosemirror-state';
import { defaultHighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';

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

export class CodeBlockNodeView implements NodeView {
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
        // 当多个命令绑定到同一个快捷键时, 会按照它们在数组中的顺序执行, 并且一旦某个命令返回 true 后续的命令就不会执行了
        cmKeymap.of([...this.codeMirrorKeymap(), ...defaultKeymap]),
        languageExtension,
        CodeMirrorView.updateListener.of((update) => this.forwardUpdate(update)),
      ],
    });

    this.updating = false; // 状态值: 用于避免外层和内层编辑器之间的更新循环
    this.dom = this.createDom(); // 节点的 DOM 节点设置为 CodeMirror 的 DOM 节点
  }

  createDom(): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'wf-code-block';

    const header = document.createElement('div');
    header.className = 'wf-code-block-header';
    header.innerHTML = `<div class="wf-code-block-point"/>`;

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
        (fromA: number, toA: number, fromB: number, toB: number, inserted: Text) => {
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

  // ProseMirror 节点更新方法: 用于同步 ProseMirror 文档中的代码块节点与 CodeMirror 编辑器之间的内容
  update(node: Node): boolean {
    // 1. 检查节点类型是否匹配
    if (node.type !== this.node.type) {
      return false;
    }

    // 2. 更新节点
    this.node = node;

    // 3. 如果正在更新, 则返回 true
    if (this.updating) return true;

    // 4. 更新文本
    const newText = node.textContent;
    const curText = this.cm.state.doc.toString();

    if (newText !== curText) {
      let start = 0;
      let curEnd = curText.length;
      let newEnd = newText.length;
      while (start < curEnd && curText.charCodeAt(start) == newText.charCodeAt(start)) {
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

  // 检查代码块前后是否有内容
  hasContentAround(): { before: boolean; after: boolean } {
    const pos = this.getPos() ?? 0;
    const afterPos = pos + this.node.nodeSize;
    const docSize = this.view.state.doc.content.size;

    return {
      before: pos > 0,
      after: afterPos < docSize,
    };
  }

  // 移出代码块
  maybeEscape(isLine: boolean, isTop: boolean): boolean {
    const { state } = this.cm;
    const { main } = state.selection;

    // 1. 如果有选中文本, 就不做处理
    if (!main.empty) {
      return false;
    }

    // 2. 边界判断: 如果光标不在代码块的行首或行尾或开始或结束位置, 则不进行处理
    if (isLine) {
      const line = state.doc.lineAt(main.head);
      const isNotBoundary = isTop ? line.from > 0 : line.to < state.doc.length;
      if (isNotBoundary) return false;
    } else {
      const isNotBoundary = isTop ? main.from > 0 : main.to < state.doc.length;
      if (isNotBoundary) return false;
    }

    const targetPos = (this.getPos() ?? 0) + (isTop ? 0 : this.node.nodeSize);
    const { before, after } = this.hasContentAround();

    // 3. 如果有内容, 则不插入空行, 否则插入空行
    let tr = this.view.state.tr;
    if (!(isTop ? before : after)) {
      const pNode = this.view.state.schema.nodes.paragraph.createAndFill();
      tr = tr.replaceWith(targetPos, targetPos, pNode!);
    }

    // 4. 创建选择
    const selection = Selection.near(tr.doc.resolve(targetPos), isTop ? -1 : 1);

    // 5. 应用事务
    tr.setSelection(selection);
    this.view.dispatch(tr);
    this.view.focus();
    return true;
  }

  // 删除整个代码块, 默认情况下, 只有代码块为空时才允许按「删除键」删除整个代码块
  deleteCodeBlock(isForce: boolean = false) {
    const isNotEmpty = this.cm.state.doc.length !== 0; // 代码块内容不为空

    // 1. 如果代码块内容不为空, 不删除代码块, 返回 false(继续执行默认的 Backspace 行为)
    if (!isForce && isNotEmpty) {
      return false;
    }

    // 2. 创建事务来删除整个代码块
    const pos = this.getPos() ?? 0;
    const tr = this.view.state.tr.delete(pos, pos + this.node.nodeSize);
    this.view.dispatch(tr);
    this.view.focus();
    return true;
  }

  codeMirrorKeymap() {
    const view = this.view;
    return [
      // 按「删除键」删除整个代码块, 默认情况下, 只有代码块为空时才允许按「删除键」删除整个代码块
      { key: 'Backspace', run: () => this.deleteCodeBlock() },
      // 按 Ctrl + 删除键, 删除整个代码块, 无论代码块是否为空
      { key: 'Ctrl-Backspace', run: () => this.deleteCodeBlock(true) },
      // 按上下左右键时, 如果光标在代码块的末尾或开头或行首或行尾, 则关闭移出代码块
      {
        key: 'ArrowUp',
        run: () => this.maybeEscape(true, true),
      },
      {
        key: 'ArrowLeft',
        run: () => this.maybeEscape(false, true),
      },
      {
        key: 'ArrowDown',
        run: () => this.maybeEscape(true, false),
      },
      {
        key: 'ArrowRight',
        run: () => this.maybeEscape(false, false),
      },
      // 按 Ctrl + Enter 键, 退出代码块, 并聚焦到下一个节点
      {
        key: 'Ctrl-Enter',
        run: () => {
          if (!exitCode(view.state, view.dispatch)) return false;
          view.focus();
          return true;
        },
      },
      // 按 Ctrl + z 键, 撤销
      {
        key: 'Ctrl-z',
        mac: 'Cmd-z',
        run: () => undo(view.state, view.dispatch),
      },
      // 按 Ctrl + Shift + z 键, 重做
      {
        key: 'Shift-Ctrl-z',
        mac: 'Shift-Cmd-z',
        run: () => redo(view.state, view.dispatch),
      },
    ];
  }

  stopEvent(): boolean {
    return true;
  }
}
