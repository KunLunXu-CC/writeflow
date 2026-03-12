import { WFCommand } from '../../types';

export interface InsertMarkdownOptions {
  markdownText: string;
}

export const insertMarkdown: WFCommand<InsertMarkdownOptions> = ({ writeFlow }, opts) => {
  if (!opts) {
    return false;
  }

  const { markdownText } = opts;
  const { dispatch, state } = writeFlow;

  const slice = writeFlow.helpers.getSliceFromMarkdown({ markdownText });
  const tr = state.tr.replaceSelection(slice);

  dispatch(tr);

  return true;
};

/** 通过 Markdown 初始化文档 */
export const initDocFromMarkdown: WFCommand<InsertMarkdownOptions> = ({ writeFlow }, opts) => {
  if (!opts) {
    return false;
  }

  const { markdownText } = opts;
  const { dispatch, state } = writeFlow;

  const slice = writeFlow.helpers.getSliceFromMarkdown({ markdownText });
  const tr = state.tr.replaceWith(0, state.doc.content.size, slice.content);

  dispatch(tr);

  return true;
};
