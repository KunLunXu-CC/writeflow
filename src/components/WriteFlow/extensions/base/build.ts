import { Plugin } from 'prosemirror-state';

const changeListenerPlugin = new Plugin({
  view(editorView) {
    return {
      update(view, prevState) {
        if (prevState.doc !== view.state.doc) {
          console.log('内容变更（plugin）');
        }
      },
    };
  },
});
