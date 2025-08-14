import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { nodes } from 'prosemirror-schema-basic';
import { tableNodes } from '@/components/WriteFlow/extensions/tmp/tableBlock';
import { listNodes } from '@/components/WriteFlow/extensions/tmp/listCopy';

const Mark = schema.spec.marks.update('code', {
  parseDOM: [{ tag: 'code' }],
  code: true,
  excludes: '_',
  exitable: true,
  toDOM: () => {
    return ['code', 0];
  },
});

const mySchema = new Schema({
  nodes: {
    ...nodes,
    ...listNodes,
    ...tableNodes,
    code_block: {
      ...nodes.code_block,
      attrs: {
        language: { default: null },
      },
    },
  },
  marks: Mark,
});

export default mySchema;
