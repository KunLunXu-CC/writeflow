import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { nodes } from 'prosemirror-schema-basic';
import { tableNodes } from '@/components/Editor/extension/tableBlock';
import { listNodes } from '@/components/Editor/extension/list';

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
  marks: schema.spec.marks,
});

export default mySchema;
