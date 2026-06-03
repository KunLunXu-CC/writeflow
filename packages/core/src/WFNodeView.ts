import { createElement, type ComponentType } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import type { Node as PMNode } from 'prosemirror-model';
import type {
  Decoration,
  DecorationSource,
  EditorView,
  NodeView,
  ViewMutationRecord,
} from 'prosemirror-view';
import type { ExtendableFunContext } from './types';

export interface WFNodeViewProps {
  node: PMNode;
  view: EditorView;
  getPos: () => number | undefined;
  nodeView: WFNodeView;
}

export interface WFNodeViewOptions {
  node: PMNode;
  view: EditorView;
  getPos: () => number | undefined;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
  context: ExtendableFunContext;
}

export type WFNodeViewClass = new (options: WFNodeViewOptions) => WFNodeView;

export class WFNodeView implements NodeView {
  public static component?: ComponentType<WFNodeViewProps>;
  public dom: HTMLElement;
  public contentDOM?: HTMLElement;
  public view: EditorView;

  private root?: Root;
  protected node: PMNode;
  protected getPos: () => number | undefined;
  protected decorations: readonly Decoration[];
  protected innerDecorations: DecorationSource;
  protected context: ExtendableFunContext;

  constructor(options: WFNodeViewOptions) {
    this.node = options.node;
    this.view = options.view;
    this.getPos = options.getPos;
    this.decorations = options.decorations;
    this.innerDecorations = options.innerDecorations;
    this.context = options.context;
    this.dom = document.createElement('div');
    this.dom.dataset.wfNodeView = options.context.extension.name;
    this.render();
  }

  private getProps = (): WFNodeViewProps => ({
    node: this.node,
    view: this.view,
    getPos: this.getPos,
    nodeView: this,
  });

  public render = () => {
    const component = (this.constructor as typeof WFNodeView).component;

    if (!component) {
      return;
    }

    const props = this.getProps();
    flushSync(() => {
      this.root ??= createRoot(this.dom);
      this.root.render(createElement(component, props));
    });
  };

  public update(node: PMNode): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;

    if (this.contentDOM) {
      return true;
    }

    this.render();
    return true;
  }

  /**
   * 决定某个 DOM 事件要不要被 ProseMirror 继续处理。
   * 返回 true：事件被 NodeView 拦住，ProseMirror 不处理
   * 返回 false：事件继续交给 ProseMirror 处理
   * */
  public stopEvent(event: Event): boolean {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (this.contentDOM?.contains(target)) {
      return false;
    }

    return Boolean(target.closest('button,input,textarea,select,option,[contenteditable="true"]'));
  }

  /**
   * 决定 ProseMirror 是否要理会某个 DOM mutation。
   *
   * 返回 true：忽略这个 DOM 变化
   * 返回 false：ProseMirror 会尝试重新解析/同步 DOM
   */
  public ignoreMutation(mutation: ViewMutationRecord): boolean {
    return mutation.type !== 'selection';
  }

  public destroy(): void {
    this.root?.unmount();
  }
}
