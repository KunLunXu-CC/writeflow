import { WFHelper } from '../../types';

/**
 * 是否位于文档的末尾
 */
export const isAtEndOfDoc: WFHelper<boolean> = ({ writeFlow }) => {
  const { state } = writeFlow;

  const isAtEnd = state.selection.$to.pos === state.doc.content.size - 1;

  return isAtEnd;
};
