import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

interface BubbleMenuViewOptions {
  content: HTMLElement;
  view: EditorView;
}

class BubbleMenuView implements PluginView {
  view: EditorView;
  content: HTMLElement;
  wrapper: HTMLElement;

  constructor({ content, view }: BubbleMenuViewOptions) {
    this.view = view;
    this.content = content;
    this.wrapper = document.createElement('div');

    this.init();
    this.update();
  }

  /**
   * 初始化
   * 1. 将内容 DOM 插入到 wrapper 中
   * 2. 将 wrapper 插入到 body 中
   */
  init = () => {
    this.wrapper.appendChild(this.content);
    document.body.appendChild(this.wrapper);
  };

  /**
   * 更新
   * 1. 如果选区为空, 则隐藏 wrapper
   * 2. 否则计算选区坐标, 并设置 wrapper 的样式
   * @returns
   */
  update = () => {
    const { state } = this.view;
    const { from, to, empty } = state.selection;

    if (empty) {
      this.wrapper.style.display = 'none';
      return;
    }

    // 1. 计算选区坐标
    const start = this.view.coordsAtPos(from);
    const end = this.view.coordsAtPos(to);
    const box = {
      top: Math.min(start.top, end.top),
      left: (start.left + end.left) / 2,
    };

    // 2. 设置 wrapper 的样式
    this.wrapper.style.display = 'block';
    this.wrapper.style.position = 'absolute';
    this.wrapper.style.top = `${box.top - 40}px`; // 放到选区上方
    this.wrapper.style.left = `${box.left}px`;
  };

  /**
   * 销毁
   * 1. 移除 wrapper
   * @returns
   */
  destroy = () => {
    this.wrapper.remove();
  };
}

export const bubbleMenuPlugin = () => {
  const menu = document.createElement('div');
  menu.innerHTML = '<button>加粗</button><button>斜体</button>';

  return new Plugin({
    key: new PluginKey('bubble-menu'),
    view: (view) => new BubbleMenuView({ view, content: menu }),
  });
};
