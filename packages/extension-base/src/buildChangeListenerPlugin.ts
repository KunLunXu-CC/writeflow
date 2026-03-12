import { Plugin } from 'prosemirror-state';
import { WriteFlow, WFEventKeys } from '@kunlunxu/wf-core';

export const buildDocChangeListenerPlugin = (args: { writeFlow: WriteFlow }) => {
  const { writeFlow } = args;

  return new Plugin({
    appendTransaction(transactions, oldState, newState) {
      const docChanged = transactions.some((tr) => tr.docChanged);

      if (!docChanged) {
        return null;
      }

      writeFlow.emit(WFEventKeys.docChange, {
        writeFlow,
        doc: newState.doc,
        value: newState.doc.toJSON(),
      });
    },
  });
};
