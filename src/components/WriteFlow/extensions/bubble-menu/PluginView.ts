import { PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export interface BubbleMenuPluginViewParams {
  view: EditorView;
  element: HTMLElement;

  // 可选配置
  options?: {
    onShow?: () => void;
    onHide?: () => void;
    onUpdate?: () => void;
    onDestroy?: () => void;
    shouldShow?: () => boolean;
  };
}

export class BubbleMenuPluginView implements PluginView {
  private element: BubbleMenuPluginViewParams['element'];
  private view: BubbleMenuPluginViewParams['view'];
  private options: BubbleMenuPluginViewParams['options'];

  constructor({ element, view, options }: BubbleMenuPluginViewParams) {
    this.view = view;
    this.element = element;
    this.options = options;
  }

  /**
   * 检查是否显示
   * 1. 如果 element 的 display 属性为 none, 则返回 false
   * 2. 否则返回 true
   */
  shouldShow = () => {
    if (this.options?.shouldShow) {
      return this.options.shouldShow();
    }

    return true;
  };

  /**
   * 显示
   * 1. 将 element 插入到 view.dom.parentNode 中
   * 2. 调用 options.onShow
   */
  show = () => {
    this.view.dom.parentNode?.appendChild(this.element);

    // 计算 left 和 top
    const { from, to } = this.view.state.selection;
    const startPos = this.view.coordsAtPos(from);
    const endPos = this.view.coordsAtPos(to);
    const left = Math.min(startPos.left, endPos.left);
    const top = Math.min(startPos.top, endPos.top);

    // 设置 element 的样式
    this.element.style.display = 'block';
    this.element.style.position = 'absolute';
    this.element.style.top = `${top - 40}px`;
    this.element.style.left = `${left}px`;

    this.options?.onShow?.();
  };

  /**
   * 隐藏
   * 1. 移除 element
   * 2. 调用 options.onHide
   */
  hide = () => {
    this.element.style.display = 'none';
    this.element.remove();
    this.options?.onHide?.();
  };

  /**
   * 更新
   * 1. 如果选区为空, 则隐藏 wrapper
   * 2. 否则计算选区坐标, 并设置 wrapper 的样式
   * 3. 调用 options.onUpdate
   * @returns
   */
  update = () => {
    const { empty } = this.view.state.selection;
    this.options?.onUpdate?.();

    if (empty) {
      this.hide();
      return;
    }

    this.show();
  };

  /**
   * 销毁
   * 1. 移除 wrapper
   * 2. 调用 options.onDestroy
   * @returns
   */
  destroy = () => {
    this.hide();
    this.options?.onDestroy?.();
  };
}
