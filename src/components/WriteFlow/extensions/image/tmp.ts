// @ts-nocheck
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      // 根据 transaction 的变化调整 decoration 位置
      set = set.map(tr.mapping, tr.doc);
      // 查看 transaction 是否添加或删除了任何占位符
      let action = tr.getMeta(this);
      if (action && action.add) {
        let widget = document.createElement('placeholder');
        let deco = Decoration.widget(action.add.pos, widget, {
          id: action.add.id,
        });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, (spec) => spec.id == action.remove.id),
        );
      }
      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    // 模拟异步上传过程
    const reader = new FileReader();
    reader.onload = () => {
      // 假设上传成功，返回一个模拟的 URL
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

function startImageUpload(view, file) {
  // 一个新对象作为这个上传的 ID
  let id = {};

  // Replace the selection with a placeholder
  // 用占位符替换所选内容
  let tr = view.state.tr;
  if (!tr.selection.empty) tr.deleteSelection();

  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } });
  view.dispatch(tr);

  uploadFile(file).then(
    (url) => {
      let pos = findPlaceholder(view.state, id);
      // 如果占位符周围的内容已被删除，则放弃
      // 这张图片
      if (pos == null) return;
      // 否则，在占位符的位置插入图片，并移除
      // 占位符
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
          .setMeta(placeholderPlugin, { remove: { id } }),
      );
    },
    () => {
      // 失败时，只需清理占位符
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }));
    },
  );
}

function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state);
  let found = decos.find(null, null, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
}
