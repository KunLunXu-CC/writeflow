import { Plugin } from 'prosemirror-state';

/**
 * 构建任务列表项点击插件
 */
export const buildTaskItemClickPlugin = () =>
  new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (_view, event) => {
          const target = event.target as HTMLElement;
          const checkboxLabel = target.closest?.('li.wf-task-list-item > label');

          if (!checkboxLabel) {
            return false;
          }

          event.preventDefault(); // 阻止 checkbox 抢走编辑器焦点，保留当前 DOM 选区
          return true;
        },
        click: (view, event) => {
          const target = event.target as HTMLElement;
          const taskItemDOM = target.closest?.('li.wf-task-list-item > label')?.parentElement;

          // 1. 如果点击的不是任务列表项的 label，则不处理
          if (!taskItemDOM) {
            return false;
          }

          // 2. 阻止默认行为, 由事务切换状态, 避免 label 的默认行为再次聚焦隐藏的 input
          event.preventDefault();

          // 3. 切换任务列表项的 checked 状态
          const $taskItem = view.state.doc.resolve(view.posAtDOM(taskItemDOM, 0));
          view.dispatch(
            view.state.tr.setNodeMarkup($taskItem.before(), undefined, {
              ...$taskItem.parent.attrs,
              checked: !$taskItem.parent.attrs.checked,
            }),
          );

          return true;
        },
      },
    },
  });
