import { WFHelper } from '@kunlunxu/wf-core';
import { Slice } from 'prosemirror-model';
import { markdownToProseMirrorNode } from './toWriteFlow';

export interface ParserMarkdownToDocOptions {
  markdownText: string;
}

/** 将 MD 转为 ProseMirror Slice */
export const getSliceFromMarkdown: WFHelper<Slice | null, { markdownText: string }> = (
  { writeFlow },
  opts,
) => {
  if (!opts) {
    return null;
  }

  const { markdownText } = opts;
  const { schema } = writeFlow;
  const doc = markdownToProseMirrorNode({ markdownText, schema });

  return Slice.maxOpen(doc.content);
};
