import { Node as PMNode } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const placeholderPluginKey = new PluginKey('wf-placeholder');

const isEmptyDoc = (doc: PMNode) => {
  const firstChild = doc.firstChild;

  return doc.childCount === 1 && !!firstChild?.isTextblock && firstChild.content.size === 0;
};

export const buildPlaceholderPlugin = (options: { getPlaceholder: () => string | undefined }) => {
  return new Plugin({
    key: placeholderPluginKey,
    props: {
      decorations(state) {
        const placeholder = options.getPlaceholder();

        if (!placeholder || !isEmptyDoc(state.doc)) {
          return null;
        }

        return DecorationSet.create(state.doc, [
          Decoration.node(0, state.doc.firstChild?.nodeSize ?? 0, {
            class: 'wf-placeholder',
            'data-placeholder': placeholder,
          }),
        ]);
      },
    },
  });
};
