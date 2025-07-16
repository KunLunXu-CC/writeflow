import { Schema } from 'prosemirror-model';
import type { WriteFlow } from '../WriteFlow.js';
import { nodes } from 'prosemirror-schema-basic';

const getSchemaByResolvedExtensions = (
  extensions: unknown[],
  editor?: WriteFlow,
): Schema => {
  console.log(
    '%c [ extensions ]-7',
    'font-size:13px; background:#bfd878; color:#ffffbc;',
    extensions,
  );
  console.log(
    '%c [ editor ]-7',
    'font-size:13px; background:#2c1dff; color:#7061ff;',
    editor,
  );
  return new Schema({
    nodes: {
      ...nodes,
      code_block: {
        ...nodes.code_block,
        attrs: {
          language: { default: null },
        },
      },
    },
    // marks: Mark,
  });
};

export default getSchemaByResolvedExtensions;
