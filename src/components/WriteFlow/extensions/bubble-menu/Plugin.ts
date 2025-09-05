import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

interface BubbleMenuViewOptions {
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

class BubbleMenuView implements PluginView {
  private element: BubbleMenuViewOptions['element'];
  private view: BubbleMenuViewOptions['view'];
  private options: BubbleMenuViewOptions['options'];

  constructor({ element, view, options }: BubbleMenuViewOptions) {
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

    const { from, to } = this.view.state.selection;

    // 1. 计算选区坐标
    const start = this.view.coordsAtPos(from);
    const end = this.view.coordsAtPos(to);
    const box = {
      top: Math.min(start.top, end.top),
      left: (start.left + end.left) / 2,
    };

    // 2. 设置 wrapper 的样式
    this.element.style.display = 'block';
    this.element.style.position = 'absolute';
    this.element.style.top = `${box.top - 40}px`; // 放到选区上方
    this.element.style.left = `${box.left}px`;

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

export const bubbleMenuPlugin = () => {
  const menu = document.createElement('div');
  menu.innerHTML = '<button>加粗</button><button>斜体</button>';

  return new Plugin({
    key: new PluginKey('bubble-menu'),
    view: (view) =>
      new BubbleMenuView({
        view,
        element: menu,
        options: {
          onShow: () => {
            console.log('onShow');
          },
          onHide: () => {
            console.log('onHide');
          },
          onUpdate: () => {
            console.log('onUpdate');
          },
          onDestroy: () => {
            console.log('onDestroy');
          },
        },
      }),
  });
};
