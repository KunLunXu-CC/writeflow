import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import nodes from '@/components/Editor/schema/schemaNodes';

// const mySchema = new Schema({
//   nodes,
//   marks: schema.spec.marks,
// });

const mySchema = new Schema({
  nodes,
  marks: schema.spec.marks,
});

export default mySchema;
