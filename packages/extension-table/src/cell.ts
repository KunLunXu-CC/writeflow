import { Node } from '@kunlunxu/wf-core';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableCell = Node.create({
  name: 'table_cell',

  addSchema: (): NodeSpec => baseTableNodes.table_cell,
});
