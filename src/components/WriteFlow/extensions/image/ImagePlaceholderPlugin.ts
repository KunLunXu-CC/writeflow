// @ts-nocheck
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { WriteFlow } from '../../types';
import { DecorationSet, Decoration, EditorView } from 'prosemirror-view';

export const IMAGE_PLACEHOLDER_PLUGIN_KEY = new PluginKey(
  'IMAGE_PLACEHOLDER_PLUGIN_KEY',
);

export const findImagePlaceholder = (state: EditorState, id: string) => {
  let decos = IMAGE_PLACEHOLDER_PLUGIN_KEY.getState(state);
  let found = decos.find(null, null, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
};

export const replaceImagePlaceholder = (
  view: EditorView,
  id: string,
  url: string,
) => {
  const { schema } = view.state;

  let pos = findImagePlaceholder(view.state, id);
  // 如果占位符周围的内容已被删除，则放弃
  // 这张图片
  if (pos == null) return;
  // 否则，在占位符的位置插入图片，并移除
  // 占位符
  view.dispatch(
    view.state.tr
      .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
      .setMeta(IMAGE_PLACEHOLDER_PLUGIN_KEY, { remove: { id } }),
  );
  return;
};

export const buildImagePlaceholderPlugin = (writeFlow: WriteFlow) => {
  return new Plugin({
    key: IMAGE_PLACEHOLDER_PLUGIN_KEY,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, decorationSet) {
        let action = tr.getMeta(IMAGE_PLACEHOLDER_PLUGIN_KEY);
        decorationSet = decorationSet.map(tr.mapping, tr.doc);

        // 新增
        if (action && action.add) {
          let widget = document.createElement('span');
          widget.className = 'image-placeholder';
          widget.textContent = '上传中...';

          let deco = Decoration.widget(action.add.pos, widget, {
            id: action.add.id,
          });
          decorationSet = decorationSet.add(tr.doc, [deco]);
        }

        // 移除
        if (action && action.remove) {
          decorationSet = decorationSet.remove(
            decorationSet.find(
              null,
              null,
              (spec) => spec.id == action.remove.id,
            ),
          );
        }

        console.log(
          '%c [ action ]-18',
          'font-size:13px; background:pink; color:#bf2c9f;',
          action,
        );

        console.log(
          '%c [ tr ]-17',
          'font-size:13px; background:pink; color:#bf2c9f;',
          tr,
        );
        // Here you would handle the logic to update decorations
        // based on transactions, e.g., adding or removing placeholders.
        return decorationSet;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
};

/**
 * 插入图片命令 - 通过文件
 * @param {object} writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const insertImageByFile: WFCommand<{ file?: File }> = async (
  writeFlow,
  options,
) => {
  const { file } = options || {};
  const { commands, state, dispatch } = writeFlow;

  if (!file) {
    return false;
  }

  const newTr = state.tr.setMeta(IMAGE_PLACEHOLDER_PLUGIN_KEY, {
    add: { id: 'xxxx', pos: state.selection.from },
  });

  dispatch(newTr);

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Url = reader.result as string;

    console.log(
      '%c [ base64Url ]-40',
      'font-size:13px; background:pink; color:#bf2c9f;',
      base64Url,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000 * 10));

    replaceImagePlaceholder(writeFlow.view, 'xxxx', base64Url);
    // commands.insertImageByUrl({ url: base64Url });
  };
  reader.readAsDataURL(file);

  return true;
};
