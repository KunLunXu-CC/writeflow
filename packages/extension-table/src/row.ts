import { Node } from '@kunlunxu/wf-core';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableRow = Node.create({
  name: 'table_row',

  addSchema: (): NodeSpec => baseTableNodes.table_row,
});
