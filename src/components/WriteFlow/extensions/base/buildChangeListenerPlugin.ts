import { Plugin } from 'prosemirror-state';
import { WriteFlow } from '@/components/WriteFlow/core/WriteFlow';
import { WFEventKeys } from '../../types';

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
