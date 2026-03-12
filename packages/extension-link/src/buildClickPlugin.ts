import { Plugin } from 'prosemirror-state';

/** 为链接点击构建插件
 * - 仅当用户按住 Alt 键并点击链接时才会触发打开链接的行为, 避免与普通点击事件冲突。
 */
export const buildClickPlugin = () =>
  new Plugin({
    props: {
      handleDOMEvents: {
        click: (view, event) => {
          // 1. 仅处理 com + 点击
          if (!event.altKey) {
            return;
          }

          // 2. 获取点击的目标元素，查找最近的 <a> 元素
          const target = event.target as HTMLElement | null;
          const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null; // 使用 closest 查找最近的 <a> 元素, 确保捕获到嵌套在其他元素内的链接

          // 3. 找到 <a> 元素并且有 href 属性, 则打开链接
          if (anchor?.href) {
            event.preventDefault();
            window.open(anchor.href, '_blank');
          }
        },
      },
    },
  });
